import "dotenv/config"
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import type { Request } from "express";

@Injectable()
export class AuthGard implements CanActivate{
 constructor(private readonly jwt:JwtService){}
    
 private extractToken(req:Request){
   let authHeaders= req.headers.authorization;
   if(authHeaders===undefined) throw new UnauthorizedException('Token manquant');
   let token=authHeaders.split(' ')[1];

 if(!token) throw new UnauthorizedException('Token manquant');

    try {
        req.user= this.jwt.verify(token,{secret:process.env.API_KEY})
        return true;
    } catch (error) {
        console.log(error)
         throw new UnauthorizedException('Token invalide');

    }
  
 }

  canActivate(context: ExecutionContext):boolean{
    let request=context.switchToHttp().getRequest();

    let tokenValide= this.extractToken(request);

    return tokenValide
    

   
     
 }
}