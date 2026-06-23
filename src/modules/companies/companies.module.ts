import { Module } from '@nestjs/common';
import { StoreModule } from '../stores/stores.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [StoreModule],
})
export class CompanyModule {}
