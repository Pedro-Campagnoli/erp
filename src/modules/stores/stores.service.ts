import { UserRole } from '@/src/generated/prisma/enums';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateStoreDto, id: string) {
    return await this.prisma.store.create({
      data: { ...dto, companyId: id },
    });
  }
  async addMember(storeId: string, userId: string, role: UserRole) {
    return this.prisma.userStore.create({
      data: { storeId, userId, role },
    });
  }
  async findAllStores(companyId: string) {
    return await this.prisma.store.findMany({
      where: { companyId },
    });
  }

  async findAllMembers(storeId: string) {
    return await this.prisma.userStore.findMany({
      where: { storeId },
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
