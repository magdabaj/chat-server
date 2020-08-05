import {EntityRepository, Repository} from "typeorm/index";
import {RoomEntity} from "./room.entity";
import {InternalServerErrorException, Logger, UnauthorizedException} from "@nestjs/common";
import {UserEntity} from "../auth/user.entity";
import {MessageEntity} from "../message/message.entity";
import {GetRoomsFilterDto} from "./dto/get-rooms-filter.dto";
import {forEachResolvedProjectReference} from "ts-loader/dist/instances";
import {CreateRoomDto} from "./dto/create-room.dto";

@EntityRepository(RoomEntity)
export class RoomRepository extends Repository<RoomEntity> {
    private logger = new Logger('RoomRepository')

    async getRooms(
        filterDto: GetRoomsFilterDto,
        user: UserEntity,
        // roomId: number
    ): Promise<RoomEntity[]> {
        const { search } = filterDto
        const query = this.createQueryBuilder('room')

        // query.where('room.participants.userId = :userId', { userId: user.id })

        if (search) query.andWhere('room.name LIKE :search', { search: `%${search}%` })

        query.leftJoinAndSelect('room.participants', 'participant')
            // .where('room.id IN (:...roomId)', {roomId:[ 1, 2, 3]})
            // .andWhere('participants.userId IN (:...userId)', {userId: user.id})

        try {
            const rooms = await query.getMany()
            let userRooms = []
            rooms.map(room => room.participants.some(participant => participant.userId === user.id ? userRooms.push(room) : null))
            if (userRooms.length > 0)
            return userRooms
            else throw new UnauthorizedException()
        } catch (e) {
            this.logger.error(`Failed to get rooms for user "${user.username}". Filters DTO: ${JSON.stringify(filterDto)}`, e.stack)
            throw new InternalServerErrorException()
        }
    }

    async createRoom(
        createRoomDto: CreateRoomDto,
        user: UserEntity,
    ): Promise<RoomEntity> {
        const room = new RoomEntity()

        const { name } = createRoomDto

        room.name = name
        room.type = false

        try {
            await room.save()
        } catch (e) {
            this.logger.error(`Failed to create a room for user "${user.username}". Data: ${createRoomDto}`, e.stack)
            throw new InternalServerErrorException()
        }

        return room
    }
}