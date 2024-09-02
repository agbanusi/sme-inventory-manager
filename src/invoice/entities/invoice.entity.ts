import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/config/repository/base-entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Invoice extends BaseEntity {
  @Column()
  invoiceNumber: string;

  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  customerEmail: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  purchaseDate: Date;

  @Column({ nullable: true })
  qrCode: string;

  @Column({ default: false })
  isPaid: boolean;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;
}
