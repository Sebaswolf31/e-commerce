import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetails } from './entities/orderDetails.entity';
import { Users } from '../users/entities/user.entity';
import { Products } from '../products/entities/product.entity';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async create(userId: string, productsIds: string[]) {
    let total = 0;
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const order = new Orders();
    order.date = new Date();
    order.user = user;

    const newOrder = await this.ordersRepository.save(order);
    console.log('Nueva orden guardada:', newOrder);
    const productsArray = await Promise.all(
      productsIds.map(async (productId) => {
        const product = await this.productsRepository.findOneBy({
          id: productId,
        });
        if (!product) {
          throw new NotFoundException(`Producto No Encontrado`);
        }
        total += Number(product.price);

        await this.productsRepository.update(
          { id: productId },
          { stock: Math.max(0, (product.stock ?? 0) - 1) }, 
        );

        console.log(product.price);
        console.log();
        return product;
      }),
    );

    const orderDetail = new OrderDetails();

    orderDetail.price = Number(Number(total).toFixed(2));
    orderDetail.products = productsArray;
    orderDetail.order = newOrder;

    await this.orderDetailsRepository.save(orderDetail);

    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: {
        orderDetails: true,
      },
    });
  }

  async findAll(): Promise<Orders[]> {
    return await this.ordersRepository.find();
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });
    if (!order) {
      throw new NotFoundException(`Orden De Compra No Encontrada`);
    }

    return order;
  }
}
