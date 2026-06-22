import { IsBoolean, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name!: string;
  @IsBoolean()
  isGlobal?: boolean;
  @IsString()
  companyId!: string;
}
