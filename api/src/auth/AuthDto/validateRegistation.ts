import { IsNotEmpty, IsString } from "class-validator";

export class AuthValidateRegistationDto{
@IsNotEmpty()
@IsString()
code: string
}