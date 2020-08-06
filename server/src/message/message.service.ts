import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MessageRepository} from "./message.repository";
import {GetMessagesFilterDto} from "./dto/get-messages-filter.dto";
import {RoomEntity} from "../room/room.entity";
import {MessageEntity} from "./message.entity";
import {UserEntity} from "../auth/user.entity";
import {CreateMessageDto} from "./dto/create-message.dto";
import {ParticipantEntity} from "../participant/participant.entity";
import {ParticipantRepository} from "../participant/participant.repository";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageRepository)
        private messageRepository: MessageRepository,
    ) {}

    async getMessages(
        filterDto: GetMessagesFilterDto,
        roomId: number,
        user: UserEntity
    ): Promise<MessageEntity[]> {
        // const messages = await this.messageRepository.createQueryBuilder('message')
        //     .leftJoinAndSelect(ParticipantEntity, 'part', 'part.userId = message.userId')
        //     // .leftJoinAndSelect(RoomEntity, 'room', 'room.id = message.roomId')
        //     .getRawMany()

        // console.log(messages)
        // const participant = await this.participantRepository.findOne({roomId: roomId},{ relations: ['room']})
        // console.log(participant)
        // if (!message.room.participants.some(part => part.userId === user.id)) throw new NotFoundException(`Room with id ${roomId} not found`)

        return this.messageRepository.getMessages(filterDto, roomId, user)
    }

    async createMessage(
        createMessageDto: CreateMessageDto,
        roomId: number,
        user: UserEntity
    ): Promise<MessageEntity> {
        const message = await this.messageRepository.findOne({roomId: roomId},{ relations: ['room']})

        if (!message.room.participants.some(part => part.userId === user.id)) throw new NotFoundException(`Room with id ${roomId} not found`)

        return this.messageRepository.createMessage(user, roomId, createMessageDto)
    }
}
