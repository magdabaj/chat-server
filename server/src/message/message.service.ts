import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MessageRepository} from "./message.repository";
import {GetMessagesFilterDto} from "./dto/get-messages-filter.dto";
import {RoomEntity} from "../room/room.entity";
import {MessageEntity} from "./message.entity";
import {UserEntity} from "../auth/user.entity";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageRepository)
        private messageRepository: MessageRepository
    ) {}

    async getMessages(
        filterDto: GetMessagesFilterDto,
        roomId: number,
        user: UserEntity
    ): Promise<MessageEntity[]> {
        return this.messageRepository.getMessages(filterDto, roomId, user)
    }
}
