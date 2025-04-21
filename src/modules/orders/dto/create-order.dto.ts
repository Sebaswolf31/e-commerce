import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true }) 
  @Type(() => PartialProductDto) 
  products: PartialProductDto[];
}

export class PartialProductDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
