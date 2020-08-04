import {MessageEntity} from "./message.entity";
import {EntityRepository, Repository} from "typeorm/index";
import {GetMessagesFilterDto} from "./dto/get-messages-filter.dto";
import {UserEntity} from "../auth/user.entity";
import {RoomEntity} from "../room/room.entity";
import {InternalServerErrorException, Logger} from "@nestjs/common";
import {privateDecrypt} from "crypto";

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

        // query.where('message.userId = :userId', { userId: users.map(user => user.id)})

        query.where('message.roomId = :roomId', { roomId })

        // query.leftJoin("message.roomId", "room")
        //     .where("message.roomId = :roomId", { roomId: room.id })

        if (search) query.andWhere('message.message LIKE :search', { search: `${search}`})

        try {
            return await query.getMany()
        } catch (e) {
            this.logger.error(`Failed to get messages for room "${roomId}"`)
            throw new InternalServerErrorException()
        }
    }
}