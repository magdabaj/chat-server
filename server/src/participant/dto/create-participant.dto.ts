import {IsNotEmpty} from "class-validator";

export class CreateParticipantDto {
    @IsNotEmpty()
    userId: number
}