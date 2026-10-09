import { io } from "socket.io-client";

/*const socket=io('http://localhost:3000',{
    auth:{
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImphaWRlbkBnbWFpbC5jb20iLCJ1c2VyUm9sZSI6IkFETUlOIiwiaWF0IjoxNzkxNDI2MjYzLCJleHAiOjE3OTE1MTI2NjN9.FchdiIt_QuwJp44w-k-mkC14rXGGGwWUn-WvJJjTlg4"
    }
});
socket.on('connect',()=>{
    console.log('connecter')
})
socket.on('inscription',(reponse)=>{
   console.log(reponse)
});*/

const socket2=io('http://localhost:3000',{
    auth:{
        key:"f169d92a822e2ea3ad75c9eb1c59da1260ecfcda5bacb8db52c3552096e8b734"
    }
});
socket2.on('expire-token',(expire)=>{
    console.log(expire)
})