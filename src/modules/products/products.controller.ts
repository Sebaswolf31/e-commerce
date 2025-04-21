import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dtos/update-products.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../../decorators/roles.decorators';
import { Role } from '../../roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async getProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    if (!page || !limit) {
      return this.productsService.getProductsService(1, 5);
    }

    return this.productsService.getProductsService(+page, +limit);
  }

  @Get('seeder')
  async addProducts() {
    return this.productsService.addProducts();
  }
  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProductService(id, updateProductDto);
  }
}
