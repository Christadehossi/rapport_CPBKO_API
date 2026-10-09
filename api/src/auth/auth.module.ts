import "dotenv/config"
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthGard } from "./auth.guard.js";
import { NotificationGateway } from "../notification/notification.gateway.js";

@Module({
  imports:[
    JwtModule.register({
      secret:process.env.API_KEY,
      signOptions:{expiresIn:'24h'
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthRepository,AuthGard,NotificationGateway]
})
export class AuthModule {}
