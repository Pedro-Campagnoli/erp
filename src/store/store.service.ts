import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateStoreDto, id: string) {
    return await this.prisma.store.create({
      data: { ...dto, companyId: id },
    });
  }

  async findAll(companyId: string) {
    return await this.prisma.store.findMany({
      where: { companyId },
    });
  }

  async findOne(id: string) {
    return await this.prisma.store.findUnique({ where: { id } });
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    return await this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
    });
  }

  async remove(id: string) {
    await this.prisma.store.delete({ where: { id } });
    return;
  }
}
