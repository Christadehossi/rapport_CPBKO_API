import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { AdminModule } from './admin/admin.module.js';
import { NotificationGateway } from './notification/notification.gateway.js';
import { NotificationModule } from './notification/notification.module.js';
import { JwtService } from '@nestjs/jwt';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'api',
    }),
    AuthModule,
    AdminModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationGateway,JwtService],
})
export class AppModule {}
