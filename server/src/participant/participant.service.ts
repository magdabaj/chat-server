import { Injectable } from '@nestjs/common';
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
        userId: number,
        createParticipantDto: CreateParticipantDto
    ): Promise<ParticipantEntity> {
        return this.participantRepository.createParticipant(createParticipantDto, userId, user)
    }
}
