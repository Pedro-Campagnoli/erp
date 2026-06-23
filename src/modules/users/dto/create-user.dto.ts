import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsBoolean()
  isOwner?: boolean;

  @IsBoolean()
  Active?: boolean;
}
