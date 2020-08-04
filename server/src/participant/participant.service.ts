import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ParticipantRepository} from "./participant.repository";
import {ParticipantEntity} from "./participant.entity";

@Injectable()
export class ParticipantService {
    constructor(
        @InjectRepository(ParticipantRepository)
        private participantRepository: ParticipantRepository
    ) {}

    async getParticipants(
        roomId: number
    ): Promise<ParticipantEntity[]> {
        return this.participantRepository.getParticipants(roomId)
    }
}
