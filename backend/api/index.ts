import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();

export default async (req, res) => {
  console.log('🔵 Incoming request:', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    headers: req.headers
  });

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    res.setHeader('Access-Control-Allow-Origin', 'https://skoolar-os.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    console.log('✅ OPTIONS response headers set:', {
      'Access-Control-Allow-Origin': 'https://skoolar-os.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Allow-Credentials': 'true'
    });
    res.status(200).end();
    return;
  }

  if (!global.app) {
    console.log('🟡 Initializing NestJS app...');
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    
    // Enable CORS for both local and production
    const allowedOrigins = [
      'http://localhost:5173',
      'https://skoolar-os.vercel.app',
    ];
    
    console.log('🟡 Allowed origins:', allowedOrigins);
    
    app.enableCors({
      origin: (origin, callback) => {
        console.log('🔍 CORS check for origin:', origin);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          console.log('✅ No origin - allowing request');
          return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
          console.log('✅ Origin allowed:', origin);
          callback(null, true);
        } else {
          console.log('⚠️ Origin not in allowed list:', origin);
          callback(null, true); // Allow anyway for now
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
    global.app = app;
    console.log('✅ NestJS app initialized');
  }
  
  console.log('🟢 Forwarding request to NestJS app');
  return server(req, res);
};
