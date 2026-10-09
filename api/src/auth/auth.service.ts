import { Injectable, InternalServerErrorException, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository.js';
import { AuthRegisterDto } from './AuthDto/register.js';
import * as bcrypt from "bcrypt"
import { AuthLoginDto } from './AuthDto/login.js';
import {  JwtService } from '@nestjs/jwt';
import { NotificationGateway } from '../notification/notification.gateway.js';
import { AuthValidateRegistationDto } from './AuthDto/validateRegistation.js';
import { Socket } from 'socket.io';
import nodemailer from 'nodemailer';
@Injectable()
export class AuthService implements OnModuleInit {

    constructor(
        private readonly authRepository:AuthRepository,
        private readonly  jwt:JwtService,
        private readonly notificationGateway:NotificationGateway
    ){}

    /**
     *lorsque l'utilisateur fait une demande d'inscription 
     *cette demande est envoyer a l'admin en attente de son approbation
     *@param data 
     */
        async ask_register(data:AuthRegisterDto){
            const{nom,prenom,email,password}=data;

            let userFound=await this.authRepository.verify_exist_email(email);
    
            if(userFound!==null){
                
                if(userFound?.status==="REJECTED"){ 
                    throw new UnauthorizedException('Vous ne pouvez pas encore refaire une demande, veuillez réessayer plus tard')
                }else if(userFound?.status==="APPROVED"){
                    throw new UnauthorizedException('Vous avez déja un compte, veuillez vous connecter')
                }else if(userFound?.status==="PENDING"){
                    throw new UnauthorizedException("vous vous ete deja inscris, veuillez attendre l'approbationde l'admin")

                }else{
                     throw new UnauthorizedException("email déja utiliser")

                }
            }else{
                
                let passwordHash=await bcrypt.hash(password,10);
                let insert=await this.authRepository.insert_user(nom,prenom,email,passwordHash);
                
                if (insert) {
                    let messageNotification=`${prenom} ${nom} demande à créer un compte`
                    let send= this.notificationGateway.DemandeInscription(messageNotification); 
                    if(send){
                            return {message:"Demande en attente d'approbation"}
                    }else{
                            throw new InternalServerErrorException('Erreur survecu lors de l\'envoie de la demande')
                    }           
                }else{
                    throw new InternalServerErrorException('Erreur survecu lors de l\'envoie de la demande')
                }
            }
        }

        /**
         * apres avoir reçu son token de validation , l'utilisateur vient valider son inscription
         * @param data 
         * @param key 
         * @returns 
         */
        async validate_registation(data:AuthValidateRegistationDto,key:string){
            
            let tokenFound=await this.authRepository.find_token(key)
            let verify=await bcrypt.compare(data.code,tokenFound?.code!);
            if(verify){
              let validate= await this.authRepository.update_status_approved(tokenFound?.userId!,key);
              if (validate!==undefined) {
                return {message:"Inscription réussie"}
              }

            }
        }

        /**
         * lorsque l'utilisateur n'utilise pas son token avant le temps donné, le token expire
         * Cette fonction fonction independemment d'un controller et est lancer au lancement du 
         * server grace a onModuleInit 
         */
         async expireToken(){

            let usersTokenFound=await this.authRepository.find_users_no_used_token();
           
            if(usersTokenFound===undefined) return
            for(const userToken of usersTokenFound){
                //=========================================
               // let expired=(new Date(Date.now()).getTime() > Number(userToken?.expireAt!)&&userToken.used===false);
                 
                let verify=  this.notificationGateway.expireToken(userToken.key,userToken.expireAt);
                // ===============================================
                if(verify){
                    let transporter=nodemailer.createTransport({
                        host:process.env.MAIL_HOST,
                        port:process.env.MAIL_PORT,
                        secure:true,

                        auth:{
                            user:process.env.AUTH_USER,
                            pass:process.env.AUTH_PASSWORD
                        }
                })

                    transporter.sendMail({
                        from:process.env.AUTH_USER,
                        to:userToken?.user.email,
                        subject:"Token de validation",
                        text:"Votre token a expiré"
                    })

                    this.authRepository.deleteToken(userToken.key)
                }
            }
            
    }
//lorsque le server sera lancer la methode expireToken debutera nsans qu'elle soit appelé

    async onModuleInit() {
        await this.expireToken()
    }

    /**
     * connection de l'utilisateur
     * @param data 
     * @returns 
     */
        async login(data:AuthLoginDto){
            const{email,password}=data
            let userFound=await this.authRepository.verify_exist_email(email)
            if(userFound===null){
                throw new NotFoundException("Utilisateur inexistant")
            }else if(userFound.status==="PENDING"){
                throw new UnauthorizedException("Veuillez attendre l'approbation de l'admin")

            }else if(userFound.status==="REJECTED"){
                throw new UnauthorizedException("Non autorisé")

            }else{
                let verify=await bcrypt.compare(password,userFound.password)

                if(!verify){
                    throw new UnauthorizedException("Mot de passe incorrecte")
                }else{
                let token= this.jwt.sign({
                        userId:userFound.id,
                        userEmail:userFound.email,
                        userRole:userFound.role
                    })

                    return {
                        message:'Connexion réussie',
                        token

                    }
                }
            }
        }
}
