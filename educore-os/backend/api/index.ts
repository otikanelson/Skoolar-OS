import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();

export default async (req, res) => {
  if (!global.app) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { cors: true }
    );
    
    app.enableCors({
      origin: '*',
      credentials: true,
    });
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));
    
    app.setGlobalPrefix('api');
    
    await app.init();
    global.app = app;
  }
  
  return server(req, res);
};
