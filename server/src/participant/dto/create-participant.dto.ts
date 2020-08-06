import {IsInt, IsNotEmpty} from "class-validator";

export class CreateParticipantDto {
    @IsNotEmpty()
    @IsInt()
    userId: number
}