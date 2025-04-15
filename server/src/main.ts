import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './Filters/http-exception.filter';

dotenv.config();

function swaggerBuilder() {
  return new DocumentBuilder()
    .setTitle('FinsureTex Sigorta Teklif Servisi - Test Case')
    .setDescription('Plaka ile sigorta teklifleri alabileceğiniz API - MOCKED')
    .setVersion('0.1.0')
    .build();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  app.setGlobalPrefix('api');

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerBuilder());
  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(parseInt(configService.get('PORT') ?? '5000'));
}

void bootstrap();
