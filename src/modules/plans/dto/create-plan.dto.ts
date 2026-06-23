import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name!: string;

  @IsInt()
  maxUsers!: number;

  @IsInt()
  maxStores!: number;

  @IsNumber()
  price!: number;
}
