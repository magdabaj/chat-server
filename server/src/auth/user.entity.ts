import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm/index";
import * as bcrypt from 'bcrypt'
import {MessageEntity} from "../message/message.entity";
import {ParticipantEntity} from "../participant/participant.entity";

@Entity()
@Unique(['username'])
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column("timestamp")
    createDate: Date

    @Column()
    salt: string

    @OneToMany(type => MessageEntity, message => message.user, { eager: true })
    messages: MessageEntity[]

    @OneToMany(type => ParticipantEntity, participants => participants.user, { eager: true })
    participants: ParticipantEntity[]

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt)
        return hash === this.password
    }
}