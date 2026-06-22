import { Module } from '@nestjs/common';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  controllers: [UsersController, RolesController],
  providers: [UsersService, RolesService],
  imports: [],
})
export class AccessModule {}
