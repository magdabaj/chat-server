import {BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm/index";
import {ParticipantEntity} from "../participant/participant.entity";
import {MessageEntity} from "../message/message.entity";

@Entity()
export class RoomEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    type: boolean

    @OneToMany(type => ParticipantEntity, participant => participant.room, { eager: false })
    participants: ParticipantEntity[]

    @OneToMany(type1 => MessageEntity, message => message.room, { eager: true })
    messages: MessageEntity[]
}