import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0) 
  stock: number;

  @IsNotEmpty()
  @IsUrl()
  imgUrl: string;

  @IsNotEmpty()
  @IsString()
  categoryName: string; 
}
