import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '@/auth/user.decorator';
import { InvoicesService } from './invoice.service';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @GetUser() user: User,
  ): Promise<Invoice> {
    return this.invoicesService.createInvoice(createInvoiceDto);
  }

  @Get(':id')
  getInvoice(@Param('id') id: string): Promise<Invoice> {
    return this.invoicesService.getInvoice(id);
  }

  @Get('order/:orderId')
  getInvoicesByOrder(@Param('orderId') orderId: string): Promise<Invoice[]> {
    return this.invoicesService.getInvoicesByOrder(orderId);
  }

  @Get(':id/verify')
  verifyInvoice(@Param('id') id: string): Promise<boolean> {
    return this.invoicesService.verifyInvoice(id);
  }

  @Get(':id/qrcode')
  getQRCode(@Param('id') id: string): Promise<string> {
    return this.invoicesService.getQRCode(id);
  }
}
