import {IsNotEmpty, IsOptional} from "class-validator";

export class GetMessagesFilterDto {
    @IsOptional()
    @IsNotEmpty()
    search: string
}