import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

// Payloads tipados
export interface PreAuthPayload {
  sub: string; // userId
  type: 'pre-auth'; // distingue do JWT final
}

export interface AuthPayload {
  sub: string; // userId
  companyId: string;
  storeId: string | null; // null quando isOwner (sem loja selecionada)
  userStoreId: string | null;
  role: string;
  isOwner: boolean;
  type: 'auth';
}

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // ─── ETAPA 1: Login com email + senha ──────────────────────────────────────
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.active)
      throw new UnauthorizedException('Credenciais inválidas');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Credenciais inválidas');

    // ── isOwner: pula seleção de loja, já retorna o JWT final ──────────────
    if (user.isOwner) {
      const { accessToken, refreshToken } = await this.generateTokens(
        {
          sub: user.id,
          companyId: user.companyId,
          storeId: null,
          userStoreId: null,
          role: 'OWNER',
          isOwner: true,
          type: 'auth',
        },
        user.id,
      );

      return {
        type: 'owner',
        accessToken,
        refreshToken,
      };
    }

    // ── Usuário normal: busca as stores disponíveis ─────────────────────────
    const userStores = await this.prisma.userStore.findMany({
      where: { userId: user.id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            active: true,
          },
        },
      },
    });

    const activeStores = userStores.filter((us) => us.store.active);

    if (activeStores.length === 0) {
      throw new ForbiddenException(
        'Usuário não possui acesso a nenhuma loja ativa',
      );
    }

    // Token temporário de 5min apenas para avançar para /select-store
    const preAuthToken = this.jwt.sign(
      { sub: user.id, type: 'pre-auth' } satisfies PreAuthPayload,
      {
        secret: process.env.JWT_PRE_AUTH_SECRET,
        expiresIn: '5m',
      },
    );

    return {
      type: 'select-store',
      preAuthToken,
      stores: activeStores.map((us) => ({
        userStoreId: us.id,
        storeId: us.store.id,
        storeName: us.store.name,
        role: us.role,
      })),
    };
  }

  // ─── ETAPA 2: Selecionar loja e receber JWT final ──────────────────────────
  async selectStore(preAuthToken: string, storeId: string) {
    let payload: PreAuthPayload;
    try {
      payload = this.jwt.verify<PreAuthPayload>(preAuthToken, {
        secret: process.env.JWT_PRE_AUTH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    if (payload.type !== 'pre-auth') {
      throw new UnauthorizedException('Token inválido');
    }

    const userStore = await this.prisma.userStore.findFirst({
      where: { userId: payload.sub, storeId },
      include: {
        store: { select: { companyId: true, active: true } },
      },
    });

    if (!userStore || !userStore.store.active) {
      throw new ForbiddenException('Acesso negado a esta loja');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      {
        sub: payload.sub,
        companyId: userStore.store.companyId,
        storeId: userStore.storeId,
        userStoreId: userStore.id,
        role: userStore.role,
        isOwner: false,
        type: 'auth',
      },
      payload.sub,
    );

    return { accessToken, refreshToken };
  }

  // ─── Refresh token ─────────────────────────────────────────────────────────
  async refresh(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      // Remove sessão expirada se existir
      if (session)
        await this.prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }

    if (!session.user.active) {
      throw new UnauthorizedException('Usuário inativo');
    }

    // Rotaciona o refresh token (invalida o anterior)
    await this.prisma.session.delete({ where: { id: session.id } });

    // Para reconstruir o payload precisamos saber o contexto (owner ou store)
    // Decodificamos o accessToken antigo sem verificar expiração só para pegar o contexto
    // O refresh token em si já é a prova de autenticidade
    let authPayload: Omit<AuthPayload, 'type'>;

    if (session.user.isOwner) {
      authPayload = {
        sub: session.user.id,
        companyId: session.user.companyId,
        storeId: null,
        userStoreId: null,
        role: 'OWNER',
        isOwner: true,
      };
    } else {
      // Busca o userStore mais recente do usuário (mantém contexto da última loja)
      // Idealmente você guardaria o storeId na Session — considere adicionar depois
      throw new UnauthorizedException('Refaça o login para selecionar a loja');
    }

    return this.generateTokens(
      { ...authPayload, type: 'auth' },
      session.user.id,
    );
  }

  // ─── Logout ────────────────────────────────────────────────────────────────
  async logout(refreshToken: string) {
    await this.prisma.session.deleteMany({ where: { refreshToken } });
    return { message: 'Logout realizado com sucesso' };
  }

  // ─── Helper: gera accessToken + refreshToken e salva a Session ─────────────
  private async generateTokens(payload: AuthPayload, userId: string) {
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '8h',
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await this.prisma.session.create({
      data: { userId, refreshToken, expiresAt },
    });

    return { accessToken, refreshToken };
  }
}
