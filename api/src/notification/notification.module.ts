import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway.js';
import { JwtService } from '@nestjs/jwt';

@Module({
    providers:[NotificationGateway,JwtService]
})
export class NotificationModule {}
