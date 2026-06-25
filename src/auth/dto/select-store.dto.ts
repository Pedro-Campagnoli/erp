import { IsString, IsUUID } from 'class-validator';

export class SelectStoreDto {
  @IsString()
  preAuthToken!: string;

  @IsUUID()
  storeId!: string;
}
