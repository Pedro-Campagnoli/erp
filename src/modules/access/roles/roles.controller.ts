import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post('companies/:companyId/roles')
  create(
    @Param('companyId') companyId: string,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.roleService.create(createRoleDto, companyId);
  }

  @Get('companies/:companyId/roles')
  findAll(@Param('companyId') companyId: string) {
    return this.roleService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
