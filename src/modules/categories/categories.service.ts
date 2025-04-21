import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { Repository } from 'typeorm';
import * as rawData from 'data.json';
import { CreateCategoryDto } from './dto/create-category.dto';

interface CategoryData {
  category: string;
}
const data: CategoryData[] = rawData as CategoryData[];

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async addCategories() {
    if (!Array.isArray(data)) {
      throw new Error('data debe ser un array válido');
    }

    for (const element of data) {
      await this.categoriesRepository
        .createQueryBuilder()
        .insert()
        .into(Categories)
        .values({ name: element.category })
        .orIgnore()
        .execute();
    }

    return 'Categorías agregadas con éxito';
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string; category: Categories }> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `La categoría "${createCategoryDto.name}" ya existe.`,
      );
    }
    const category = this.categoriesRepository.create({
      name: createCategoryDto.name,
    });
    const savedCategory = await this.categoriesRepository.save(category);
    return {
      message: `La categoría "${savedCategory.name}" ha sido creada exitosamente.`,
      category: savedCategory,
    };
  }

  async findAll(): Promise<Categories[]> {
    return await this.categoriesRepository.find();
  }

  async findByName(name: string): Promise<Categories | null> {
    return this.categoriesRepository.findOne({ where: { name } });
  }

  async create(category: Partial<Categories>): Promise<Categories> {
    const newCategory = this.categoriesRepository.create(category);
    return this.categoriesRepository.save(newCategory);
  }
}
