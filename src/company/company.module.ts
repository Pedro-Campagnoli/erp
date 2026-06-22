import { Module } from '@nestjs/common';
import { StoreModule } from '../store/store.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [StoreModule],
})
export class CompanyModule {}
