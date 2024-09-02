import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { CreateOrderDto } from './dtos/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async createManualOrder(createOrderDto: CreateOrderDto) {
    const inventory = await this.inventoryRepository.findOne({
      where: {
        id: createOrderDto.inventoryId,
      },
    });
    if (!inventory) {
      throw new Error('Inventory not found');
    }

    const order = this.orderRepository.create({
      ...createOrderDto,
      inventory,
      orderType: 'manual',
    });

    await this.orderRepository.save(order);
    return order;
  }

  async createOnlineOrder(createOrderDto: CreateOrderDto) {
    const inventory = await this.inventoryRepository.findOne({
      where: {
        id: createOrderDto.inventoryId,
      },
    });
    if (!inventory) {
      throw new Error('Inventory not found');
    }

    const order = this.orderRepository.create({
      ...createOrderDto,
      inventory,
      orderType: 'online',
    });

    await this.orderRepository.save(order);
    return order;
  }

  // Add more methods as needed (e.g., findAll, findOne, update, remove)
}
