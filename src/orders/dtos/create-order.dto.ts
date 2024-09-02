import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsNumber()
  inventoryId: string;

  @IsNumber()
  customerId: string;
}
