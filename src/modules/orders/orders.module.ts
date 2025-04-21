import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from './entities/orderDetails.entity';
import { Orders } from './entities/order.entity';
import { Products } from '../products/entities/product.entity';
import { Users } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetails, Orders, Products, Users])], 
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
