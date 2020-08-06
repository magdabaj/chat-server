import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class GetRoomsFilterDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    search: string
}