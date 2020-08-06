import {
    Body,
    Controller,
    Get,
    Logger, NotFoundException,
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
import {ParticipantService} from "../participant/participant.service";

@Controller('message')
@UseGuards(AuthGuard())
export class MessageController {
    private logger = new Logger('MessageController')
    constructor(private messageService: MessageService, private participantService: ParticipantService) {}

    @Get('/:roomId')
    async getMessages(
        @Query(ValidationPipe) filterDto: GetMessagesFilterDto,
        @Param('roomId', ParseIntPipe) roomId: number,
        @Req() req,
    ): Promise<MessageEntity[]> {
        // todo maybe there's more effective way to do this
        const authorised = await this.participantService.getParticipantsForRoom(roomId, req.user)

        if (!authorised) throw new NotFoundException(`Room with id ${roomId} not found`)

        return this.messageService.getMessages(filterDto, roomId, req.user)
    }

    @Post('/:roomId')
    async createMessage(
        @Body(ValidationPipe) createMessageDto: CreateMessageDto,
        @Param('roomId', ParseIntPipe) roomId: number,
        @Req() req,
    ): Promise<MessageEntity> {
        const authorised = await this.participantService.getParticipantsForRoom(roomId, req.user)

        if (!authorised) throw new NotFoundException(`Room with id ${roomId} not found`)

        return this.messageService.createMessage(createMessageDto, roomId, req.user)
    }
}
