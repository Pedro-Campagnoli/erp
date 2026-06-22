import { IsBoolean, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name!: string;

  @IsBoolean()
  active?: boolean;

  @IsString()
  companyId!: string;
}
