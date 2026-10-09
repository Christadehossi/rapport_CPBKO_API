import"dotenv/config"
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminRepository } from './admin.repository.js';
import * as bcrypt from  "bcrypt"
import * as nodemailer from "nodemailer"
import * as crypto from "node:crypto"
@Injectable()
export class AdminService {
    constructor(private readonly adminRepository:AdminRepository){}

    async get_all_users_pending(userRole:string){
        if(userRole!=="ADMIN") throw new ForbiddenException("Violation d'acces aux droits de l'admin")
        return await this.adminRepository.get_all_users_pending()!==undefined 
                ? await this.adminRepository.get_all_users_pending()
                :"Aucun utilisateur en attente"
    }
/**
 * Seul l'admin peut approuver une demande de creation de compte
 * lorsque la demande est accepté un code de validation est envoyé sur le gmail de l'utilisateur 
 * qui va expirer dans 5 min
 * @param userRole 
 * @param id 
 * @returns 
 */
    async approved_user(userRole:string,id:number){
        if(userRole!=="ADMIN") throw new ForbiddenException("Violation d'acces aux droits de l'admin");
        let userFound= await this.adminRepository.find_user(id);

        if(userFound?.token === undefined){

        let code= crypto.randomInt(1000,99999);
        
        let codeHash=await bcrypt.hash(String(code),10);
        // 5 minutes
        let expireAt= new Date (Date.now()+300000);
        let key=crypto.randomBytes(32).toString('hex');
        let userValide=await this.adminRepository.approved_user(id,String(codeHash),expireAt,key);

        if (userValide[0]===null) throw new UnauthorizedException('Utilisateur non en attente');
        console.log("c'est partie")
            let transporter= nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                port:process.env.MAIL_PORT,
                secure:true,

                auth:{
                    user:process.env.AUTH_USER,
                    pass:process.env.AUTH_PASSWORD
                }
            });

                await transporter.sendMail({
                    from:process.env.AUTH_USER,
                    to:userValide[0]?.email,
                    subject:'Token de validation',
                    text:`Votre code de validation est ${code} et expire dans 5 minutes`
                })

                let validate=await transporter.verify();
                
                    if ( validate) {
                    return  {
                    message:"Votre code de validation a été envoyer sur votre compte gmail",
                    key:userValide[1].key
                };
                } else{
                    throw new UnauthorizedException("Echec de l'envoie du token de validation");
                }
        
}
    }

   
    /**
     *  Seul l'admin peut rejeter une demande de creation de compte
     * lorsque la demande est rejeté l'utlilisateur est blocqué pendant 1h
     * @param userRole 
     * @param id 
     * @returns 
     */
    async rejected_user(userRole:string,id:number){
            if(userRole!=="ADMIN") throw new ForbiddenException("Violation d'acces aux droits de l'admin");
            //1h
            let blockedAt=new Date(Date.now()+3600000);
           let userBlocked=await this.adminRepository.rejected_user(id,blockedAt);
           if(userBlocked[0]===null) throw new UnauthorizedException('Utilisateur non en attente');
           if(userBlocked[2].asBlocked) return {message:"Votre inscription a été rejeter"}


    }
}
