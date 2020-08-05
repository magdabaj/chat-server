import {ParticipantEntity} from "./participant.entity";
import {EntityRepository, Repository} from "typeorm/index";
import {InternalServerErrorException, Logger, UnauthorizedException} from "@nestjs/common";
import {UserEntity} from "../auth/user.entity";
import {CreateParticipantDto} from "./dto/create-participant.dto";
import {map} from "rxjs/operators";
import {RoomEntity} from "../room/room.entity";

@EntityRepository(ParticipantEntity)
export class ParticipantRepository extends Repository<ParticipantEntity> {
    private logger = new Logger('ParticipantRepository')

    async getParticipants(
        roomId: number,
        user: UserEntity,
    ): Promise<ParticipantEntity[]> {
        const query = this.createQueryBuilder('participant')

        query.where('participant.roomId = :roomId', { roomId })

        try {
            const participants =  await query.getMany()
            console.log(participants)
            if (participants.some(p => p.userId === user.id))
            return participants
            // else throw new UnauthorizedException()
        } catch (e) {
            this.logger.error(`Failed to get participants for room "${roomId}"`, e.stack)
            throw new InternalServerErrorException()
        }
    }

    async getUserRoomsId(
        user: UserEntity
    ): Promise<any> {
        const query = this.createQueryBuilder('participant')

        query.select('participant.roomId')
        query.where('participant.userId = :userId', { userId: user.id })

        try {
            return await query.getRawMany()
        } catch (e) {
            this.logger.error(`Failed to get participants for user "${user.username}"`, e.stack)
            throw new InternalServerErrorException()
        }

    }

    async getRooms(
        user: UserEntity
    ): Promise<ParticipantEntity[]> {
        const query = this.createQueryBuilder('participant')
        const query2 = this.createQueryBuilder('participant')
        const query3 = this.createQueryBuilder('part')

        let roomsIds = []

        query.select('participant.roomId')
        query.where('participant.userId = :userId', { userId: user.id })


        try {
            let rooms = await query.getRawMany()
            rooms.map(room => roomsIds.push(room.participant_roomId))
            query2.where('participant.roomId IN (:...roomId)', {roomId: roomsIds})
            // query3.leftJoinAndSelect('part.roomId', 'room')
            //     .where('participant.roomId IN (:...roomId)', { roomId: roomsIds})
                // .select(['room.id', 'participant.id', 'room.name'])
            return await query2.getMany()
        } catch (e) {
            this.logger.error(`Failed to get participants for user "${user.username}"`, e.stack)
            throw new InternalServerErrorException()
        }
    }

    async createParticipant(
        roomId: number,
        createParticipantDto: CreateParticipantDto,
        user: UserEntity,
    ): Promise<ParticipantEntity> {
        const participant = new ParticipantEntity()
        const { userId } = createParticipantDto

        participant.roomId = roomId
        participant.userId = userId

        try {
            await participant.save()
        } catch (e) {
            this.logger.error(`Failed to create a participant for user "${user.username}" and room "${roomId}".`, e.stack)
            throw new InternalServerErrorException()
        }

        delete participant.user

        return participant

    }

}