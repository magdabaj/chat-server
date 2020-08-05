import {IsNotEmpty, IsString} from "class-validator";

export class CreateMessageDto {
    @IsNotEmpty()
    message: string
}