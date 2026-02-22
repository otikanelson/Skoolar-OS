import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express, { Request, Response } from 'express';

const expressApp = express();
let app: any;

async function bootstrap() {
  if (!app) {
    console.log('🟡 Initializing NestJS app...');
    
    try {
      app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        { logger: ['error', 'warn', 'log'] }
      );
      
      // Enable CORS
      const allowedOrigins = [
        'http://localhost:5173',
        'https://skoolar-os.vercel.app',
      ];
      
      console.log('🟡 Allowed origins:', allowedOrigins);
      
      app.enableCors({
        origin: (origin: string, callback: Function) => {
          console.log('🔍 CORS check for origin:', origin);
          
          if (!origin || allowedOrigins.includes(origin)) {
            console.log('✅ Origin allowed:', origin);
            callback(null, true);
          } else {
            console.log('⚠️ Origin not in allowed list, but allowing anyway:', origin);
            callback(null, true);
          }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        exposedHeaders: ['Authorization'],
      });
      
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
      }));
      
      await app.init();
      console.log('✅ NestJS app initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize NestJS app:', error);
      throw error;
    }
  }
  
  return app;
}

export default async function handler(req: Request, res: Response) {
  try {
    console.log('🔵 Incoming request:', {
      method: req.method,
      url: req.url,
      origin: req.headers.origin,
    });

    // Handle preflight OPTIONS requests immediately
    if (req.method === 'OPTIONS') {
      console.log('✅ Handling OPTIONS preflight request');
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'https://skoolar-os.vercel.app');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.status(200).end();
      return;
    }

    // Initialize NestJS app
    await bootstrap();
    
    console.log('🟢 Forwarding request to NestJS app');
    return expressApp(req, res);
  } catch (error) {
    console.error('❌ Handler error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
