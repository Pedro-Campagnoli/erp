import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET não definido no ambiente');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: AuthPayload) {
    // Garante que não é um token temporário sendo usado em rotas protegidas
    if (payload.type !== 'auth') {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      userId: payload.sub,
      companyId: payload.companyId,
      storeId: payload.storeId,
      userStoreId: payload.userStoreId,
      role: payload.role,
      isOwner: payload.isOwner,
    };
  }
}
