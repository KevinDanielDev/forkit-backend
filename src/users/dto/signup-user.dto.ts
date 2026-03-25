import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class SignUpUserDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  @MinLength(2)
  codeCountry: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(10)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(8)
  password: string;
}
