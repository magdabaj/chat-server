import {IsNotEmpty, IsOptional} from "class-validator";

export class CreateRoomDto {
    @IsOptional()
    name: string

    // @IsNotEmpty()
    // userId: number
}