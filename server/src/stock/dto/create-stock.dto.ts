import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStockDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  name: string;  // <-- changed from companyName to name
}
