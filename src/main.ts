import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fs from 'fs';
import express from 'express';
import https from 'https';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
config();

const swaggerConfig = new DocumentBuilder()
  .setTitle('My PostGram NestJS app')
  .setDescription('REST API documentation')
  .setVersion('1.0.0')
  .addTag('PostGram')
  .build();

async function bootstrap() {
  try {
    const server = express();
    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_PRIVATE_KEY),
      cert: fs.readFileSync(process.env.SSL_PUBLIC_KEY),
    };
    https.createServer(httpsOptions, server).listen(443);
    console.log('srever is runing on PORT:', 443);
  } catch {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api/v1/docs', app, document);
    await app.listen(PORT, () =>
      console.log('srever is runing on PORT:', PORT),
    );
  }
}
bootstrap();
