import { Controller,Get, UseGuards,Req, Param } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { AuthGard } from '../auth/auth.guard.js';
import type { Request } from 'express';
import { AuthRepository } from '../auth/auth.repository.js';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService:AdminService){}
    @UseGuards(AuthGard)
    @Get("get-all-users-pending")
    async get_all_users_pending(@Req() req:Request){
        console.log("salut")
        return await this.adminService.get_all_users_pending(req.user.userRole);
    }
    
    // l'admin accepte la demande d'un utilisateur
    @UseGuards(AuthGard)
    @Get("approved-user/:id")
    async approved_user(@Param('id') id:string,@Req() req:Request ){
        return await this.adminService.approved_user(req.user.userRole,Number(id));
    }

    //l'admin refuse la demande de l'utilisateur
    @UseGuards(AuthGard)
    @Get("rejected-user/:id")
    async rejected_user(@Param('id') id:string,@Req() req:Request ){
       return this.adminService.rejected_user(req.user.userRole,Number(id));
    }
}
