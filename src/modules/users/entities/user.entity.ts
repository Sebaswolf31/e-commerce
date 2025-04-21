import { Orders } from '../../orders/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({
  name: 'USERS',
})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  password: string;

  @Column({ type: 'bigint', nullable: true })
  phone: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isEditor?: boolean;

  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn({ name: 'orders_id' })
  orders: Orders[];
}
