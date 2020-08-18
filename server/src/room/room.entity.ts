import {BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm/index";
import {ParticipantEntity} from "../participant/participant.entity";
import {MessageEntity} from "../message/message.entity";
import {IsOptional} from "class-validator";

@Entity()
export class RoomEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    name: string

    @Column()
    isPublic: boolean

    @OneToMany(type => ParticipantEntity, participant => participant.room, { eager: true })
    participants: ParticipantEntity[]

    @OneToMany(type1 => MessageEntity, message => message.room, { eager: true })
    messages: MessageEntity[]
}