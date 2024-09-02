import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('manual')
  createManualOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createManualOrder(createOrderDto);
  }

  @Post('online')
  createOnlineOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOnlineOrder(createOrderDto);
  }

  // Add more endpoints as needed (e.g., GET, PUT, DELETE)
}
