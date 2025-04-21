import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entities/product.entity';
import { Categories } from '../categories/entities/category.entity';
import { readFileSync } from 'fs';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dtos/update-products.dto';

const rawData = JSON.parse(
  readFileSync('data.json', 'utf-8'),
);

interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl: string;
  category: string;
}

if (!Array.isArray(rawData)) {
  throw new Error('El archivo JSON no es un array válido');
}

const data: ProductData[] = rawData as ProductData[];

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}
  async addProducts() {
    if (!Array.isArray(data)) {
      throw new Error('El archivo JSON no es un array válido');
    }

    if (!Array.isArray(data)) {
      throw new Error('El archivo JSON no contiene un array válido');
    }

    for (const element of data) {
      const category = await this.categoriesRepository.findOne({
        where: { name: element.category },
      });

      if (!category) {
        console.error(`Categoría "${element.category}" no encontrada`);
        continue;
      }
      const existingProduct = await this.productsRepository.findOne({
        where: { name: element.name },
      });

      const product = this.productsRepository.create({
        name: element.name,
        description: element.description,
        price: element.price,
        stock: element.stock,
        imgUrl: element.imgUrl || 'default-image.jpg',
        category: category,
      });

      if (existingProduct) {
        await this.productsRepository.update(existingProduct.id, product);
      } else {
        await this.productsRepository.save(product);
      }
    }

    return 'Productos agregados o actualizados con éxito';
  }

  async getProductsService(page: number, limit: number) {
    const [products, total] = await this.productsRepository.findAndCount({
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      total,
      page,
      limit,
      data: products,
    };
  }

  async updateProductService(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<{ message: string; product: Products }> {
    const existingProduct = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException(
        `El producto con ID "${productId}" no existe.`,
      );
    }

    if (updateProductDto.categoryName) {
      const category = await this.categoriesRepository.findOne({
        where: { name: updateProductDto.categoryName },
      });

      if (!category) {
        throw new BadRequestException(
          `La categoría "${updateProductDto.categoryName}" no existe.`,
        );
      }

      existingProduct.category = category;
    }

    Object.assign(existingProduct, updateProductDto);

    const updatedProduct = await this.productsRepository.save(existingProduct);

    return {
      message: `El producto "${updatedProduct.name}" ha sido actualizado correctamente.`,
      product: updatedProduct,
    };
  }

  async findByName(name: string): Promise<Products | null> {
    return this.productsRepository.findOne({ where: { name } });
  }

  async create(
    productData: Partial<Products>,
    category: Categories,
  ): Promise<Products> {
    const newProduct = this.productsRepository.create({
      ...productData,
      category,
    });
    return this.productsRepository.save(newProduct);
  }
}
