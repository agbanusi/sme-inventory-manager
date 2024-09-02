import { BaseEntity } from '@/config/repository/base-entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isEmployee: boolean;

  @Column({ nullable: true })
  employer: string;
}
