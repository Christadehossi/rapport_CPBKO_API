import "dotenv/config"
import * as bcrypt from "bcrypt"
import * as readline from "node:readline";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
let adapter=new PrismaPg({connectionString:process.env["DATABASE_URL"]})
let prismaConnect=new PrismaClient({adapter})


const rl= readline.createInterface({
    input:process.stdin,
    output:process.stdout
});
async function ask(question:string) {

     return new Promise (resolve=>{
        rl.question(question, resolve) 
      });
    
}

async function create_admin() {
    console.clear()
    console.log("\x1b[1;4;34mCreation de l'admin\x1b[0m");
    let nom =String (await ask("Nom: "));
    let prenom=String(await ask ("Prenom: "));
    let email = String(await ask ("Email: "));
    let password=String(await ask ("Password: "));

    let passwordHash=await bcrypt.hash(password,10);
    
    try {
        
         await prismaConnect.user.create({
        data:{
            nom,
            prenom,
            email,
            password:passwordHash,
            status:"NULL",
            role:"ADMIN"

        }
    })
            console.log("\x1b[1;33mCreation réussie avec succès \x1b[0m");

    } catch (error) {
        console.log(error)
    }
   
}

 async function drop(){
    await prismaConnect.$executeRawUnsafe(`
    TRUNCATE TABLE
    "Address",
    "Bien",
        "Client",
        "Estimation",
        "Rapport",
        "Template",
        "User"
    RESTART IDENTITY CASCADE
`);
console.log("netoyage réussie")
 }

 create_admin()