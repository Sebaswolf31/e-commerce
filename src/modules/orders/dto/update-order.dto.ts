import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsArray, IsString, IsUUID } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsString()
  @IsUUID(4)
  userId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) 
  productsIds?: string[];
}
