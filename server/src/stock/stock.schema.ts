import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema()
export class Stock {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  name: string;  // <-- kept it as "name" like you asked

  @Prop({ default: false })
  isFavorite: boolean;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
