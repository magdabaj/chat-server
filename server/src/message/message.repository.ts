import {MessageEntity} from "./message.entity";
import {EntityRepository, Repository} from "typeorm/index";
import {GetMessagesFilterDto} from "./dto/get-messages-filter.dto";
import {UserEntity} from "../auth/user.entity";
import {RoomEntity} from "../room/room.entity";
import {InternalServerErrorException, Logger, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {privateDecrypt} from "crypto";
import {CreateMessageDto} from "./dto/create-message.dto";
import {ParticipantEntity} from "../participant/participant.entity";

@EntityRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {
    private logger = new Logger('MessageRepository')

    async getMessages(
        filterDto: GetMessagesFilterDto,
        roomId: number,
        user: UserEntity
    ): Promise<MessageEntity[]> {

        const { search } = filterDto

        const query = this.createQueryBuilder('message')

        query.where('message.roomId = :roomId', { roomId })

        // query.leftJoin(ParticipantEntity, 'participant', "participant.roomId = message.roomId")

        if (search) query.andWhere('message.message LIKE :search', { search: `${search}`})

        try {
            return await query.getMany()
        } catch (e) {
            this.logger.error(`Failed to get messages for room "${roomId}"`)
            throw new InternalServerErrorException()
        }
    }

    async createMessage(
        user: UserEntity,
        roomId: number,
        createMessageDto: CreateMessageDto
    ): Promise<MessageEntity> {
        const newMessage = new MessageEntity()

        const { message } = createMessageDto

        newMessage.roomId = roomId
        newMessage.message = message
        newMessage.receivedAt = new Date()
        newMessage.user = user

        try {
            await newMessage.save()
        } catch (e) {
            this.logger.error(`Failed to create a message for user "${user.username}" in room ${roomId}. Data: ${createMessageDto}`, e.stack)
            throw new InternalServerErrorException()
        }

        delete newMessage.user

        return newMessage
    }
}