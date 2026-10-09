import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthRegisterDto } from './AuthDto/register.js';
import { AuthLoginDto } from './AuthDto/login.js';
import { AuthValidateRegistationDto } from './AuthDto/validateRegistation.js';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    /**
     * Demande de creation d'un compte
     */
    @Post("ask-registation")
    async ask_register(@Body() data:AuthRegisterDto){
        return await this.authService.ask_register(data);
    }

    /**
     * validation de la creation apres l'approbation de l'admin
     */
    @Post('validate-registation/:key')
    async validate_registation(@Param('key') key:string, @Body() data:AuthValidateRegistationDto){
        return this.authService.validate_registation(data,key);
    }
    
    // connexion au compte
    @Post('login')
    async login(@Body() date:AuthLoginDto){
        return await this.authService.login(date)
    }

    
}


