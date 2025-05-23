import { Controller, Get, Post, Body, Query, Delete, Patch, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { Stock } from './stock.schema';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateStockDto } from './dto/create-stock.dto';
import { AddMultipleStocksDto } from './dto/add-multiple-stocks.dto';
import { DeleteStockDto } from './dto/delete-stock.dto';

@ApiTags('Portfolio')
@Controller('portfolio')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stocks by user email' })
  @ApiQuery({ name: 'email', required: true })
  async getStocks(@Query('email') email: string): Promise<Stock[]> {
    Logger.log('async getStocks by email: ' + email);
    return this.stockService.getStocksByEmail(email);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Add a new stock to user portfolio' })
  @ApiBody({ type: CreateStockDto })
  async addStock(@Body() createStockDto: CreateStockDto): Promise<Stock> {
    const { email, symbol, name } = createStockDto;
    return this.stockService.addStock(email, symbol, name);
  }

  @Post('/add-multiple')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Add multiple stocks to user portfolio' })
  @ApiBody({ type: AddMultipleStocksDto })
  async addMultipleStocks(@Body() addMultipleStocksDto: AddMultipleStocksDto): Promise<{ added: boolean }> {
    const { email, stocks } = addMultipleStocksDto;
    const multipleStocks = this.stockService.addMultipleStocks(email, stocks);
    return multipleStocks;
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
