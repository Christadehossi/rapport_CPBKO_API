import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { Injectable } from "@nestjs/common";

let adapter=new PrismaPg({connectionString:process.env.DATABASE_URL})
let prismaConnect=new PrismaClient({adapter})

@Injectable()
export class AdminRepository{
        async get_all_users_pending(){
            return await prismaConnect.user.findMany({
                select:{
                    nom:true,
                    prenom:true,
                    email:true
                },
                where:{
                    status:"PENDING"
                }
            })
        }

        async find_user(id:number){
         return await prismaConnect.user.findUnique({
                where:{
                    id
                },
                include:{
                    token:true
                }

            })
        }

         async approved_user(id:number,code:string,expireAt:Date,key:string){
            return await prismaConnect.$transaction([
                 prismaConnect.user.findUnique({
                where:{
                    id,
                    status:"PENDING"
                }
            }),
                 prismaConnect.token.create({
                    data:{
                        code,
                        expireAt,
                        key,
                       user:{
                        connect:{
                            id
                        }
                       }
                    }
                })
        ])
        }

        async rejected_user(id:number,deblockAt:Date) {
            return await prismaConnect.$transaction([
                prismaConnect.user.findUnique({
                    where:{
                        id,
                        status:"PENDING"
                    }
                }),
                prismaConnect.user.update({
                    where:{
                        id
                    },
                    data:{
                        status:"REJECTED"
                    }
                }),
                prismaConnect.blocked.create({
                    data:{
                        deblockAt,
                        user:{
                            connect:{
                                id
                            }
                        }

                    }
                })
            ])
            
        }
}