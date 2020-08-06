import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RoomRepository} from "./room.repository";
import {GetRoomsFilterDto} from "./dto/get-rooms-filter.dto";
import {UserEntity} from "../auth/user.entity";
import {RoomEntity} from "./room.entity";
import {CreateRoomDto} from "./dto/create-room.dto";
import {ParticipantRepository} from "../participant/participant.repository";
import {CreateParticipantDto} from "../participant/dto/create-participant.dto";
import {ParticipantEntity} from "../participant/participant.entity";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomRepository)
        private roomRepository: RoomRepository,
        // @InjectRepository(ParticipantRepository)
        // private participantRepository: ParticipantRepository,
    ) {
    }

    async getRooms(
        filterDto: GetRoomsFilterDto,
        user: UserEntity
    ): Promise<RoomEntity[]> {
        // const rooms = await this.roomRepository.find({relations: ['participants']})
        // console.log(rooms.filter(room => room.participants.some(part => part.userId === user.id)))
        return this.roomRepository.getRooms(filterDto, user)
    }

    async getOneRoom(
        user: UserEntity,
        roomId: number
    ): Promise<RoomEntity> {
        const room = await this.roomRepository.getOneRoom(roomId, user)

        if (!room) throw new NotFoundException(`Room with id ${roomId} not found`)

        return room
    }

    async createRoom(
        createRoomDto: CreateRoomDto,
        user: UserEntity
    ): Promise<RoomEntity> {
        // participant repository add all participants

        return  await this.roomRepository.createRoom(createRoomDto, user)
        // await this.createParticipant({roomId: room.id}, user)
    }
}
