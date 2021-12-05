import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fs from 'fs';
import express from 'express';
import https from 'https';
import { config } from 'dotenv';
config();

async function bootstrap() {
  try {
    const server = express();
    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_PRIVATE_KEY),
      cert: fs.readFileSync(process.env.SSL_PUBLIC_KEY),
    };
    https.createServer(httpsOptions, server).listen(443);
    console.log(console.log('srever is runing on PORT:', 443));
  } catch {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    await app.listen(PORT, () =>
      console.log('srever is runing on PORT:', PORT),
    );
  }
}
bootstrap();
