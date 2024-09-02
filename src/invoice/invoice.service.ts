import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Order } from '../orders/entities/order.entity';
import * as QRCode from 'qrcode';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const order = await this.orderRepository.findOne({
      where: { id: createInvoiceDto.orderId },
    });
    if (!order) {
      throw new NotFoundException(
        `Order with ID "${createInvoiceDto.orderId}" not found`,
      );
    }

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      order,
      invoiceNumber: this.generateInvoiceNumber(),
      purchaseDate: new Date(),
    });

    await this.invoiceRepository.save(invoice);
    invoice.qrCode = await this.generateQRCode(invoice.id);
    return this.invoiceRepository.save(invoice);
  }

  async generateQRCode(invoiceId: string): Promise<string> {
    const url = `${process.env.SERVER_URL}/invoices/${invoiceId}`;
    return QRCode.toDataURL(url);
  }

  async getInvoice(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: { order: true },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }
    return invoice;
  }

  async getInvoicesByOrder(orderId: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({ where: { order: { id: orderId } } });
  }

  async verifyInvoice(id: string): Promise<boolean> {
    const invoice = await this.getInvoice(id);
    return invoice.isPaid;
  }

  async getQRCode(id: string): Promise<string> {
    const invoice = await this.getInvoice(id);
    return invoice.qrCode;
  }

  private generateInvoiceNumber(): string {
    // Implement your invoice number generation logic here
    return `INV-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }
}
