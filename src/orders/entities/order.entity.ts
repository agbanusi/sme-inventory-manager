import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/config/repository/base-entity';
import { User } from '../../auth/entities/user.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';

@Entity()
export class Order extends BaseEntity {
  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  orderType: 'manual' | 'online';

  @ManyToOne(() => User)
  customer: User;

  @ManyToOne(() => Inventory, (inventory) => inventory.orders)
  inventory: Inventory;
}