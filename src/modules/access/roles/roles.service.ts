import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}
  create(dto: CreateRoleDto, companyId: string) {
    return this.prisma.role.create({ data: { ...dto, companyId } });
  }

  findAll(companyId: string) {
    return this.prisma.role.findMany({ where: { companyId } });
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return updateRoleDto;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
