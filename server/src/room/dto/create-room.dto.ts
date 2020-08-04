import {IsOptional} from "class-validator";

export class CreateRoomDto {
    @IsOptional()
    name: string
}