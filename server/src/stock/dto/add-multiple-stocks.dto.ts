import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StockItemDto {
  @IsNotEmpty()
  symbol: string;

  @IsNotEmpty()
  name: string;
}

export class AddMultipleStocksDto {
  @IsEmail()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockItemDto)
  stocks: StockItemDto[];
}
