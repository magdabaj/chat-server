import {IsNotEmpty} from "class-validator";
import {ParseIntPipe} from "@nestjs/common";


export class CreateParticipantDto {
    @IsNotEmpty()
    userId: number
}