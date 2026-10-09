import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import {  } from "class-transformer";
import { AuthGard } from './auth/auth.guard.js';
import { JwtService } from '@nestjs/jwt';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true,
    forbidNonWhitelisted:true
  }))
 // app.useGlobalGuards(new AuthGard())
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
