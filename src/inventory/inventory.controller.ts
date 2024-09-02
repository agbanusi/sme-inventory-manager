import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateInventoryItemDto } from './dtos/create-inventory-item.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { GetUser } from '@/auth/user.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  createItem(
    @Body() createInventoryItemDto: CreateInventoryItemDto,
    @GetUser() user: any,
  ): Promise<Inventory> {
    return this.inventoryService.createItem(createInventoryItemDto, user);
  }

  @Get()
  getAllItems(@GetUser() user: any): Promise<Inventory[]> {
    return this.inventoryService.getAllItems(user);
  }

  @Get(':id')
  getItemById(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<Inventory> {
    return this.inventoryService.getItemById(id, user);
  }

  @Put(':id')
  updateItem(
    @Param('id') id: string,
    @Body() updateInventoryItemDto: CreateInventoryItemDto,
    @GetUser() user: any,
  ): Promise<Inventory> {
    return this.inventoryService.updateItem(id, updateInventoryItemDto, user);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string, @GetUser() user: any): Promise<void> {
    return this.inventoryService.deleteItem(id, user);
  }

  @Get('low-stock')
  getLowStockItems(@GetUser() user: any): Promise<Inventory[]> {
    return this.inventoryService.getLowStockItems(user);
  }

  @Put(':id/adjust-quantity')
  adjustQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @GetUser() user: any,
  ): Promise<Inventory> {
    return this.inventoryService.adjustQuantity(id, quantity, user);
  }
}
