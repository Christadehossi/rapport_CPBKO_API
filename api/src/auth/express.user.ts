import "express"

   

declare module 'express-serve-static-core' {
 export interface Request{
    user:{
         userId:number
         userEmail:string,
         userRole:string
      };
    }
}
