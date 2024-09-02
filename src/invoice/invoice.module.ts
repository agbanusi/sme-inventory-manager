import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Order } from '../orders/entities/order.entity';
import { InvoicesService } from './invoice.service';
import { InvoicesController } from './invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Order])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoiceModule {}
