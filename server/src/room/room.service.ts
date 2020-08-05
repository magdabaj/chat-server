import { Injectable } from '@nestjs/common';
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
        return this.roomRepository.getRooms(filterDto, user)
    }

    async createRoom(
        createRoomDto: CreateRoomDto,
        user: UserEntity
    ): Promise<RoomEntity> {
        // participant repository add all participants

        const room = await this.roomRepository.createRoom(createRoomDto, user)
        // await this.createParticipant({roomId: room.id}, user)
        return room;
    }

    // private async createParticipant(
    //     createParticipantDto: CreateParticipantDto,
    //     user
    // ): Promise<ParticipantEntity> {
    //     return this.participantRepository.createParticipant(createParticipantDto, user)
    // }
}
