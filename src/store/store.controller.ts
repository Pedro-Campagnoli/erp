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
import { StoreService } from './store.service';

@Controller()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('company/:companyId/store')
  create(@Param('companyId') companyId: string, @Body() dto: CreateStoreDto) {
    return this.storeService.create(dto, companyId);
  }

  @Get('company/:companyId/stores')
  findAll(@Param('companyId') companyId: string) {
    return this.storeService.findAll(companyId);
  }

  @Get('store/:id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Patch('store/:id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete('store/:id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
