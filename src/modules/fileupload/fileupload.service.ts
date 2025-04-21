import { Injectable, NotFoundException } from '@nestjs/common';
import { FileuploadRepository } from './fileupload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from '../products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileuploadService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    private readonly fileuploadRepository: FileuploadRepository,
  ) {}
  async uploadProductImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    const uploadImage =
      await this.fileuploadRepository.uploadProductImage(file);

    await this.productsRepository.update(product.id, {
      imgUrl: uploadImage.secure_url,
    });

    return 'Producto Actualizado con éxito';
  }
}
