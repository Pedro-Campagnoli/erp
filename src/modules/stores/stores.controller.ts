import { UserRole } from '@/src/generated/prisma/enums';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller()
export class StoresController {
  constructor(private readonly storeService: StoresService) {}

  @Post('companies/:companyId/store')
  create(@Param('companyId') companyId: string, @Body() dto: CreateStoreDto) {
    return this.storeService.create(dto, companyId);
  }

  @Post('/stores/:id/members')
  addMember(
    @Param('id') storeId: string,
    @Body('userId') userId: string,
    @Body('role') role: UserRole,
  ) {
    return this.storeService.addMember(storeId, userId, role);
  }

  @Get('companies/:companyId/stores')
  findAll(@Param('companyId') companyId: string) {
    return this.storeService.findAllStores(companyId);
  }

  @Get('stores/:storeId/members')
  findAllMembers(@Param('storeId') storeId: string) {
    return this.storeService.findAllMembers(storeId);
  }

  @Get('stores/:id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Patch('stores/:id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete('stores/:id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
