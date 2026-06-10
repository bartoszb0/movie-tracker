import { IsEmail, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsEmail()
  declare email: string;

  @IsString()
  @MinLength(6)
  declare password: string;

  @IsString()
  @MinLength(6)
  declare confirmPassword: string;
}
