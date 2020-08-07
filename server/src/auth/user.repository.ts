import {UserEntity} from "./user.entity";
import {EntityRepository, Repository} from "typeorm/index";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt'
import {ConflictException, InternalServerErrorException} from "@nestjs/common";
import {SignupCredentialsDto} from "./dto/signup-credentials.dto";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    async signUp(signUpCredentialsDto: SignupCredentialsDto): Promise<void> {
        const { username, password, email } = signUpCredentialsDto

        const user = this.create()
        user.username = username
        user.email = email
        user.isOnline = false
        user.createDate = new Date()
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)

        try {
            await user.save()
        } catch (e) {
            if (e.code === '23505') throw new ConflictException('Username already exists')
            else throw new InternalServerErrorException()
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto

        const user = await this.findOne({ username })

        if (user && await user.validatePassword(password)) return user.username
        else return null
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}