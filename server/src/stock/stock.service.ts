import { Logger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stock, StockDocument } from './stock.schema';
import { Model } from 'mongoose';

@Injectable()
export class StockService {
  constructor(@InjectModel(Stock.name) private stockModel: Model<StockDocument>) {}

  async getStocksByEmail(emailAddress: string): Promise<Stock[]> {
    const stocks = await this.stockModel.find({ email: emailAddress }).exec();
    return stocks;
  }

  async addStock(email: string, symbol: string, name: string): Promise<Stock> {
    const newStock = new this.stockModel({ email, symbol, name });
    return newStock.save();
  }

  async deleteStock(email: string, symbol: string): Promise<{ deleted: boolean }> {
    const result = await this.stockModel.deleteOne({ email, symbol });
    return { deleted: result.deletedCount > 0 };
  }

  async toggleFavorite(email: string, symbol: string): Promise<Stock | null> {
    const stock = await this.stockModel.findOne({ email, symbol });
    if (!stock) {
      return null;
    }
    stock.isFavorite = !stock.isFavorite;
    return stock.save();
  }

  async populateInitialStocks(): Promise<void> {
    const count = await this.stockModel.estimatedDocumentCount();
    if (count === 0) {
      await this.stockModel.insertMany([
        { email: 'beni@email.com', symbol: 'AAPL', name: 'Apple Inc.', isFavorite: false },
        { email: 'beni@email.com', symbol: 'GOOGL', name: 'Alphabet Inc.', isFavorite: false },
        { email: 'beni@email.com', symbol: 'NICE', name: 'Nice Ltd.', isFavorite: true },
        { email: 'benir@email.com', symbol: 'NICE', name: 'Nice Ltd.', isFavorite: false },
        { email: 'benir@email.com', symbol: 'NICE.TA', name: 'Nice Ltd.', isFavorite: true },
      ]);
      console.log('Initial stocks inserted');
    }
  }
}
