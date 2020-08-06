import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class GetMessagesFilterDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    search: string
}