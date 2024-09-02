import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsNumber()
  amount: number;

  @IsString()
  orderId: string;
}
