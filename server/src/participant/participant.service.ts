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
        const authorised = await this.isParticipant(roomId, user)

        if (!authorised) throw new NotFoundException(`Room with id ${roomId} not found.`)

        return this.participantRepository.getParticipants(roomId)
    }

    async createFirstParticipant(
        user: UserEntity,
        roomId: number
    ): Promise<ParticipantEntity> {
        return this.participantRepository.createFirstParticipant(roomId, user)
    }

    async createParticipant(
        user: UserEntity,
        userId: number,
        roomId: number
    ): Promise<ParticipantEntity> {
        const authorised = await this.isParticipant(roomId, user)

        if (!authorised) throw new NotFoundException(`Room with id ${roomId} not found`)

        return this.participantRepository.createParticipant(roomId, userId)
    }

    async isParticipant(
        roomId: number,
        user: UserEntity
    ): Promise<boolean> {
        try {
            const participant = await this.participantRepository.findOneOrFail({roomId: roomId},{ relations: ['room']})

            return participant.room.participants.some(part => part.userId === user.id)
        } catch (e) {
            console.log(e)
            return false
        }
    }
}
