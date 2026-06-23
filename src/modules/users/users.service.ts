import { PrismaService } from '@/src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto, companyId: string) {
    dto.password = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        ...dto,
        companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        isOwner: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  findAll(companyId: string) {
    return this.prisma.user.findMany({
      where: {
        companyId,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
