import { IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name!: string;
  @IsString()
  cnpj!: string;
  @IsString()
  planId!: string;
}
