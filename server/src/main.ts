import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StockService } from './stock/stock.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';   // ✅ Add this!

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Stock Management API')
    .setDescription('API for managing user stock portfolios')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  

  const stockService = app.get(StockService);
  // await stockService.populateInitialData();
  await stockService.populateInitialStocks(); // populate on startup

  await app.listen(3000);
}
bootstrap();
