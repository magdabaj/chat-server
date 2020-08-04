import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm/index";
import * as bcrypt from 'bcrypt'

@Entity()
@Unique(['username'])
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    salt: string

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt)
        return hash === this.password
    }
}