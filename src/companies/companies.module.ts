import { Module } from '@nestjs/common';
import { StoreModule } from '../store/store.module';
import { CompanyController } from './companies.controller';
import { CompanyService } from './companies.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [StoreModule],
})
export class CompanyModule {}
