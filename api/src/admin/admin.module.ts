import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { AdminRepository } from './admin.repository.js';
import { AuthGard } from '../auth/auth.guard.js';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports:[],
  controllers: [AdminController],
  providers: [AdminService,AdminRepository,AuthGard,JwtService]
})
export class AdminModule {}
