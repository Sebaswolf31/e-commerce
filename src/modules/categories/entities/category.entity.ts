import { Products } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({
  name: 'CATEGORIES',
})
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}
