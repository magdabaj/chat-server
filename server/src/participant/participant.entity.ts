import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm/index";
import {UserEntity} from "../auth/user.entity";
import {RoomEntity} from "../room/room.entity";

@Entity()
@Unique(['userId', 'roomId'])
export class ParticipantEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => UserEntity, user => user.participants, { eager: false})
    user: UserEntity

    @Column()
    userId: number

    @ManyToOne(type => RoomEntity, room => room.participants, {eager:true})
    room: RoomEntity

    @Column()
    roomId: number
}