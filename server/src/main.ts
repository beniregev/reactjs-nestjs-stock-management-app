import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { StockService } from './stock/stock.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { StockModule } from './stock/stock.module'; // ✅ ONLY import StockModule

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const serverPort = configService.get<number>('SERVER_PORT') || 3000;
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Stock Management API')
    .setDescription('API for managing user stock portfolios')
    .setVersion('1.0')
    .build();

  // ✅ Only include StockModule here
  const document = SwaggerModule.createDocument(app, config, {
    include: [StockModule],
  });

  SwaggerModule.setup('api', app, document);

  const stockService = app.get(StockService);
  await stockService.populateInitialStocks();

  await app.listen(serverPort);
  console.log(`Server is running on http://localhost:${serverPort}`);
}
bootstrap();
