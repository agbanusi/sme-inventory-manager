import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInventoryItemDto } from './dtos/create-inventory-item.dto';
import { User } from '../auth/entities/user.entity';
import { InventoryRepository } from './repositories/inventory.repository';
import { Inventory } from './entities/inventory.entity';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(private inventoryItemRepository: InventoryRepository) {}

  async createItem(
    createInventoryItemDto: CreateInventoryItemDto,
    owner: User,
  ): Promise<Inventory> {
    const item = this.inventoryItemRepository.create({
      ...createInventoryItemDto,
      owner,
    });
    return this.inventoryItemRepository.save(item);
  }

  async getAllItems(owner: User): Promise<Inventory[]> {
    return this.inventoryItemRepository.find({
      where: { owner: { id: owner.id } },
    });
  }

  async getItemById(id: string, owner: User): Promise<Inventory> {
    const item = await this.inventoryItemRepository.findOne({
      where: { id, owner: { id: owner.id } },
    });
    if (!item) {
      throw new NotFoundException(`Inventory item with ID "${id}" not found`);
    }
    return item;
  }

  async updateItem(
    id: string,
    updateInventoryItemDto: CreateInventoryItemDto,
    owner: User,
  ): Promise<Inventory> {
    const item = await this.getItemById(id, owner);
    Object.assign(item, updateInventoryItemDto);
    return this.inventoryItemRepository.save(item);
  }

  async deleteItem(id: string, owner: User): Promise<void> {
    const result = await this.inventoryItemRepository.delete({
      id,
      owner: { id: owner.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory item with ID "${id}" not found`);
    }
  }

  async getLowStockItems(owner: User): Promise<Inventory[]> {
    return this.inventoryItemRepository.find({
      where: { quantity: LessThanOrEqual(10) },
    });
  }

  async adjustQuantity(
    id: string,
    quantity: number,
    owner: User,
  ): Promise<Inventory> {
    const item = await this.getItemById(id, owner);
    item.quantity += quantity;
    if (item.quantity < 0) {
      item.quantity = 0;
    }
    return this.inventoryItemRepository.save(item);
  }
}
