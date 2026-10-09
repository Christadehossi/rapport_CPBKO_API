import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthRegisterDto{
    @IsNotEmpty()
    @IsString()
    nom:string

     @IsNotEmpty()
    @IsString()
    prenom:string

     @IsNotEmpty()
    @IsEmail()
    email: string

     @IsNotEmpty()
    @IsString()
    password:string

}