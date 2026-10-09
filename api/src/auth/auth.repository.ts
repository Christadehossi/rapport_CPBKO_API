import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { Injectable } from "@nestjs/common";

let adapter=new PrismaPg({connectionString:process.env["DATABASE_URL"]})
let prismaConnect=new PrismaClient({adapter})
@Injectable()
export  class AuthRepository{

    async verify_exist_email(email:string){
        return await prismaConnect.user.findUnique({
            where:{
                email
            }
        })
    }

   
    async insert_user(nom:string,prenom:string,email:string,password:string){
       
        try {
           await prismaConnect.user.create({
                data:{
                    nom,
                    prenom,
                    email,
                    password
                    
                }
            })
            return true;
        } catch (error) {
            
            console.log(error)
            return false
        }
    }

    async find_token(key:string){
        return await prismaConnect.token.findUnique({
            include:{
                user:true
            },
            where:{
                key
                
            }
        });
    }

    async find_users_no_used_token(){
        return await prismaConnect.token.findMany({
            
            where:{
                used:false
            },
            include:{
                user:true
            }
        })
    }
    async update_status_approved(id:number,key:string){
    
          return  await prismaConnect.$transaction([
            prismaConnect.token.update({
                where:{
                    key
                },
                data:{
                    used:true
                }
            }),
                prismaConnect.user.update({
               
               where:{
                    id
               },
                data:{
                    status:"APPROVED"
                }
            }),
            prismaConnect.token.delete({
                where:{
                    key
                }
            })
        ])
    }

    async deleteToken(key:string){
        try {
             await prismaConnect.token.delete({
                where:{
                    key
                }
            })
            return true
        } catch (error) {
             await prismaConnect.token.delete({
                where:{
                    key
                }
            })
        }
            
        }    
          
        
}