import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  Validate,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { MatchPassword } from 'src/helpers/matchPassword';

export class CreateUserDto {
  /**
   * @example JuanManuel
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  /**
   * @example juanma2011@hotmail.com
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * @example Juanma2011#
   */

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;

  /**
   * @example Juanma2011#
   */

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  /**
   * @example calleFalsa123
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  /**
   * @example 3205678906
   */

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  /**
   * @example Colombia
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country: string;

  /**
   * @example Manizales
   */

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city: string;
}

export class LoginUserDto {
  /**
   * @example juanma2011@hotmail.com
   */

  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * @example Juanma2011#
   */

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;
}
