import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockService } from './stock.service';
import { Stock, StockSchema } from './stock.schema';
import { StockController } from './stock.controller'; // ✅ Import the controller

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
  ],
  controllers: [StockController], // ✅ REGISTER the controller
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
