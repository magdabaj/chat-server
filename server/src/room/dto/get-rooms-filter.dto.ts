import {IsNotEmpty, IsOptional} from "class-validator";

export class GetRoomsFilterDto {
    @IsOptional()
    @IsNotEmpty()
    search: string
}