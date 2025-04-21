import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [CategoriesModule, ProductsModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
