import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    ParseIntPipe, Post,
    Query,
    Req,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {MessageService} from "./message.service";
import {GetMessagesFilterDto} from "./dto/get-messages-filter.dto";
import {MessageEntity} from "./message.entity";
import {CreateMessageDto} from "./dto/create-message.dto";

@Controller('message')
@UseGuards(AuthGuard())
export class MessageController {
    private logger = new Logger('MessageController')
    constructor(private messageService: MessageService) {
    }

    @Get('/:roomId')
    getMessages(
        @Query(ValidationPipe) filterDto: GetMessagesFilterDto,
        @Param('roomId', ParseIntPipe) roomId: number,
        @Req() req,
    ): Promise<MessageEntity[]> {
        return this.messageService.getMessages(filterDto, roomId, req.user)
    }

    @Post('/:roomId')
    createMessage(
        @Body(ValidationPipe) createMessageDto: CreateMessageDto,
        @Param('roomId', ParseIntPipe) roomId: number,
        @Req() req,
    ): Promise<MessageEntity> {
        return this.messageService.createMessage(createMessageDto, roomId, req.user)
    }
}
