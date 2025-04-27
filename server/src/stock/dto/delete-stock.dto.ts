import { IsEmail, IsString } from 'class-validator';

export class DeleteStockDto {
  @IsEmail()
  email: string;

  @IsString()
  symbol: string;
}
