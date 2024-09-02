import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { BaseEntity } from '@/config/repository/base-entity';
import { Order } from '@/orders/entities/order.entity';

@Entity()
export class Inventory extends BaseEntity {
  @Column()
  name: string;

  @Column()
  sku: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column()
  reorderPoint: number;

  @ManyToOne(() => User)
  owner: User;

  @OneToMany(() => Order, (orders) => orders.inventory)
  orders: Order[];
}
