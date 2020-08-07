import {BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm/index";
import {UserEntity} from "../auth/user.entity";
import {RoomEntity} from "../room/room.entity";

@Entity()
export class MessageEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    message: string

    @Column("timestamp",{ nullable: true })
    receivedAt: Date

    @Column("timestamp", { nullable: true })
    readAt: Date
    //
    // @OneToMany(type => UserEntity, user => user.messages, { eager: true })
    // readBy: UserEntity[]

    @ManyToOne(type => UserEntity, user => user.messages, { eager: false })
    user: UserEntity

    @Column()
    userId: number

    @ManyToOne(type => RoomEntity, room => room.messages, { eager: false })
    room: RoomEntity

    @Column()
    roomId: number
}