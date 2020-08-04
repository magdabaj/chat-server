import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm/index";
import {UserEntity} from "../auth/user.entity";
import {RoomEntity} from "../room/room.entity";

@Entity()
export class ParticipantEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => UserEntity, user => user.participants, { eager: false })
    user: UserEntity

    @Column()
    userId: number

    @ManyToOne(type => RoomEntity, room => room.participants, { eager: false })
    room: RoomEntity

    @Column()
    roomId: number
}