// guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// ─── EXEMPLO DE USO EM QUALQUER CONTROLLER ────────────────────────────────────
//
// import { UseGuards, Get } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';
//
// @UseGuards(JwtAuthGuard)
// @Get('profile')
// getProfile(@CurrentUser() user: AuthUser) {
//   // user.userId, user.storeId, user.role, user.companyId...
//   return user;
// }
