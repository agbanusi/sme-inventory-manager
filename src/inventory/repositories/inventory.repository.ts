import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmRepository } from 'src/config/repository/typeorm.repository';
import { Inventory } from '../entities/inventory.entity';

@Injectable()
export class InventoryRepository extends TypeOrmRepository<Inventory> {
  constructor(private readonly dataSource: DataSource) {
    super(Inventory, dataSource.createEntityManager());
  }
}
