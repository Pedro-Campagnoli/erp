import { PrismaService } from '@/src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}
  async create(createPlanDto: CreatePlanDto) {
    return await this.prisma.plan.create({ data: createPlanDto });
  }
  async findAll() {
    return await this.prisma.plan.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.plan.findUnique({ where: { id } });
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    return await this.prisma.plan.update({
      where: { id },
      data: updatePlanDto,
    });
  }

  async remove(id: string) {
    await this.prisma.plan.delete({ where: { id } });
    return;
  }
}
