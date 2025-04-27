import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { StockService } from './stock/stock.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const serverPort = configService.get<number>('SERVER_PORT') || 3000;

  //  Global Validation 
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

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

  await app.listen(serverPort);
  console.log(`Server is running on http://localhost:${serverPort}`);
}
bootstrap();
