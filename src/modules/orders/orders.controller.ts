import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() order: CreateOrderDto) {
    const { userId, products } = order;
    const productIds = products.map((product) => product.id);
    return this.ordersService.create(userId, productIds);
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }
}
