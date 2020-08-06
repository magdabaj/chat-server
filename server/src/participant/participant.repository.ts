import {ParticipantEntity} from "./participant.entity";
import {EntityRepository, Repository} from "typeorm/index";
import {ConflictException, InternalServerErrorException, Logger} from "@nestjs/common";
import {UserEntity} from "../auth/user.entity";
import {CreateParticipantDto} from "./dto/create-participant.dto";

@EntityRepository(ParticipantEntity)
export class ParticipantRepository extends Repository<ParticipantEntity> {
    private logger = new Logger('ParticipantRepository')

    async getParticipants(
        roomId: number,
    ): Promise<ParticipantEntity[]> {
        const query = this.createQueryBuilder('participant')

        query.where('participant.roomId = :roomId', { roomId })

        try {
            return await query.getMany()
        } catch (e) {
            this.logger.error(`Failed to get participants for room "${roomId}"`, e.stack)
            throw new InternalServerErrorException()
        }
    }

    async createFirstParticipant(
        roomId: number,
        user: UserEntity,
    ): Promise<ParticipantEntity> {
        const participant = new ParticipantEntity()

        participant.roomId = roomId
        participant.userId = user.id

        try {
            await participant.save()
        } catch (e) {
            this.logger.error(`Failed to create a participant for user "${user.username}" and room "${roomId}".`, e.stack)
            throw new InternalServerErrorException()
        }

        delete participant.user

        return participant
    }

    async createParticipant(
        roomId: number,
        userId: number,
    ): Promise<ParticipantEntity> {
        const participant = new ParticipantEntity()

        participant.roomId = roomId
        participant.userId = userId

        try {
            await participant.save()
        } catch (e) {
            if (e.code === '23505') throw new ConflictException('Participant already exists')
            else {
                this.logger.error(`Failed to create a participant for user "${userId}" and room "${roomId}".`, e.stack)
                throw new InternalServerErrorException()
            }
        }

        return participant
    }

}