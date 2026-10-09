import { SubscribeMessage, WebSocketGateway, WebSocketServer,OnGatewayConnection } from '@nestjs/websockets';
import { Server,Socket } from "socket.io";
  import { JwtService } from "@nestjs/jwt";
import { log } from 'console';
import { emit } from 'process';

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection{

    constructor(private readonly jwt:JwtService){}
    @WebSocketServer()
    server:Server

 //Lorsque l'utilisateur se connecte on lui attribut automatique son room en fonction de role   
    async handleConnection(client: Socket) {

        let token=client.handshake.auth.token;
           // console.log(token);

        if(!token){ 
             client.disconnect();
             return
            }
        
        let tokenDecode= this.jwt.verify(token,{secret:process.env.API_KEY});
     // console.log(client.id);

        if(tokenDecode.userRole==="ADMIN"){          
            await client.join("admins");
        }else if(tokenDecode.userRole==="REDACTEUR") {
            await client.join(["redacteur",`user:${tokenDecode.userId}`]);
        }else{
            await client.join(`user:${tokenDecode.userId}`);
        }

    }

// envoie de la notification aux admin apres une demande d'inscription 
  //@SubscribeMessage('inscription')
  DemandeInscription(message:string){
    console.log('salut');
    
    return this.server.to("admins").emit('inscription',message);
  }

   expireToken( key:string,expiredAt:Date){
    let room=`temporyRoom: ${key}`;
    return this.server.to(room).emit("expire-token",()=>{
        let expired=(new Date(Date.now()).getTime() > (expiredAt).getTime());
        if(expired){
            this.server.in(room).socketsLeave(room);
            return true
        }else{
            return false
        }
    })
  }
}


