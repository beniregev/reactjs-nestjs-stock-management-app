import { Controller, Get, Post, Body, Query, Delete, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { Stock } from './stock.schema';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateStockDto } from './dto/create-stock.dto';
import { DeleteStockDto } from './dto/delete-stock.dto';

@ApiTags('Stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stocks by user email' })
  @ApiQuery({ name: 'email', required: true })
  async getStocks(@Query('email') email: string): Promise<Stock[]> {
    return this.stockService.getStocksByEmail(email);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Add a new stock to user portfolio' })
  @ApiBody({ type: CreateStockDto })
  async addStock(@Body() createStockDto: CreateStockDto): Promise<Stock> {
    const { email, symbol, companyName } = createStockDto;
    return this.stockService.addStock(email, symbol, companyName);
  }

  @Delete()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Delete a stock by user email and symbol' })
  @ApiQuery({ name: 'email', required: true })
  @ApiQuery({ name: 'symbol', required: true })
  async deleteStock(
    @Query('email') email: string,
    @Query('symbol') symbol: string,
  ): Promise<{ deleted: boolean }> {
    return this.stockService.deleteStock(email, symbol);
  }

  @Patch('/favorite')
  @ApiOperation({ summary: 'Toggle favorite status of a stock' })
  @ApiQuery({ name: 'email', required: true })
  @ApiQuery({ name: 'symbol', required: true })
  async toggleFavorite(
    @Query('email') email: string,
    @Query('symbol') symbol: string,
  ): Promise<Stock | null> {
    return this.stockService.toggleFavorite(email, symbol);
  }
}
