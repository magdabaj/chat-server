import {EntityRepository, Repository} from "typeorm/index";
import {RoomEntity} from "./room.entity";
import {InternalServerErrorException, Logger, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {UserEntity} from "../auth/user.entity";
import {MessageEntity} from "../message/message.entity";
import {GetRoomsFilterDto} from "./dto/get-rooms-filter.dto";
import {forEachResolvedProjectReference} from "ts-loader/dist/instances";
import {CreateRoomDto} from "./dto/create-room.dto";
import {constants} from "http2";

@EntityRepository(RoomEntity)
export class RoomRepository extends Repository<RoomEntity> {
    private logger = new Logger('RoomRepository')

    async getRooms(
        filterDto: GetRoomsFilterDto,
        user: UserEntity,
    ): Promise<RoomEntity[]> {
        const { search } = filterDto

        // const rooms = await this.find({relations: ['participants']})
        const query = this.createQueryBuilder('room')

        if (search) query.andWhere('room.name LIKE :search', { search: `%${search}%` })

        query.leftJoinAndSelect('room.participants', 'participant')

        try {
            const rooms = await query.getMany()
            return rooms.filter(room => room.participants.some(part => part.userId === user.id))
        } catch (e) {
            this.logger.error(`Failed to get rooms for user "${user.username}". Filters DTO: ${JSON.stringify(filterDto)}`, e.stack)
            throw new InternalServerErrorException()
        }
    }

    async getOneRoom(
        roomId: number,
        user: UserEntity
    ): Promise<RoomEntity> {
        const query = this.createQueryBuilder('room')

        query.leftJoinAndSelect('room.participants', 'participant')
        query.where('room.id = :roomId', {roomId})

        try {
            const rooms = await query.getMany()
            return rooms.find(room => room.participants.some(part => part.userId === user.id))
        } catch (e) {
            this.logger.error(`Failed to get room with id ${roomId} for user "${user.username}".`, e.stack)
            throw new InternalServerErrorException()
        }
    }

    async createRoom(
        createRoomDto: CreateRoomDto,
        user: UserEntity,
    ): Promise<RoomEntity> {
        const room = new RoomEntity()

        const { name, isPublic } = createRoomDto

        room.name = name
        room.isPublic = isPublic

        try {
            await room.save()
        } catch (e) {
            this.logger.error(`Failed to create a room for user "${user.username}". Data: ${createRoomDto}`, e.stack)
            throw new InternalServerErrorException()
        }

        return room
    }
}