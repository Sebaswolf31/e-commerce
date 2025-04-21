import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { ProductsService } from '../products/products.service';
import * as fs from 'fs';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  async onModuleInit() {
    this.logger.log('🚀 Ejecutando Seeder desde JSON...');
    const data = this.loadData();

    await this.seedCategories(data);
    await this.seedProducts(data);

    this.logger.log('✅ Seeder ejecutado correctamente');
  }

  private loadData() {
    const filePath = 'data.json';
    if (!fs.existsSync(filePath)) {
      this.logger.error('❌ Archivo data.json no encontrado');
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  private async seedCategories(data: any[]) {
    const uniqueCategories = [...new Set(data.map((p) => p.category))];

    for (const categoryName of uniqueCategories) {
      const exists = await this.categoriesService.findByName(categoryName);
      if (!exists) {
        await this.categoriesService.create({ name: categoryName });
        this.logger.log(`📌 Categoría creada: ${categoryName}`);
      }
    }
  }

  private async seedProducts(data: any[]) {
    for (const product of data) {
      const exists = await this.productsService.findByName(product.name);
      if (!exists) {
        const category = await this.categoriesService.findByName(
          product.category,
        );
        if (!category) continue;

        await this.productsService.create(
          {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imgUrl: 'default-image.jpg',
          },
          category,
        );

        this.logger.log(`🛒 Producto creado: ${product.name}`);
      }
    }
  }
}
