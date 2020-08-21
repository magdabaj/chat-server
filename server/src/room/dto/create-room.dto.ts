import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateRoomDto {
    @IsOptional()
    @IsString()
    name: string

    @IsNotEmpty()
    isPublic: boolean
}