import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ParticipantRepository} from "./participant.repository";
import {ParticipantEntity} from "./participant.entity";
import {UserEntity} from "../auth/user.entity";
import {CreateParticipantDto} from "./dto/create-participant.dto";

@Injectable()
export class ParticipantService {
    constructor(
        @InjectRepository(ParticipantRepository)
        private participantRepository: ParticipantRepository
    ) {}

    async getParticipants(
        roomId: number,
        user: UserEntity
    ): Promise<ParticipantEntity[]> {
        return this.participantRepository.getParticipants(roomId, user)
    }

    async getRooms(
        user: UserEntity
    ): Promise<ParticipantEntity[]> {
        return this.participantRepository.getRooms(user)
    }

    async createParticipant(
        user: UserEntity,
        createParticipantDto: CreateParticipantDto,
        roomId: number
    ): Promise<ParticipantEntity> {
        return this.participantRepository.createParticipant(roomId, createParticipantDto, user)
    }

    async getParticipantsForRoom(
        roomId: number,
        user: UserEntity
    ): Promise<any> {
        try {
            const participant = await this.participantRepository.findOneOrFail({roomId: roomId},{ relations: ['room']})

            return participant.room.participants.some(part => part.userId === user.id) && participant !== undefined
        } catch (e) {
            return false
        }
    }
}
