import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { SelectStoreDto } from './dto/select-store.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login
  // isOwner  → { type: 'owner', accessToken, refreshToken }
  // normal   → { type: 'select-store', preAuthToken, stores[] }
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // POST /auth/select-store
  // Recebe preAuthToken + storeId → { accessToken, refreshToken }
  @Post('select-store')
  selectStore(@Body() dto: SelectStoreDto) {
    return this.authService.selectStore(dto.preAuthToken, dto.storeId);
  }

  // POST /auth/refresh
  // Rotaciona o refreshToken → { accessToken, refreshToken }
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  // POST /auth/logout
  // Invalida a sessão pelo refreshToken
  @Post('logout')
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
