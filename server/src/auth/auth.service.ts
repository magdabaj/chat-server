import {Injectable, Logger, UnauthorizedException, UseGuards} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";
import {JwtService} from "@nestjs/jwt";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {JwtPayloadInterface} from "./jwt-payload.interface";
import {UserEntity} from "./user.entity";
import {SignupCredentialsDto} from "./dto/signup-credentials.dto";
import * as config from "config";
import {AuthGuard} from "@nestjs/passport";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService')

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    signUp(signupCredentialsDto: SignupCredentialsDto): Promise<void> {
        return this.userRepository.signUp(signupCredentialsDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto)

        if (!username) throw new UnauthorizedException('Invalid credentials')

        const payload: JwtPayloadInterface = { username }
        const accessToken = await this.jwtService.sign(payload)

        this.logger.log(`Generated JWT Token with payload ${JSON.stringify(payload)}`)

        return { accessToken }
    }

    // @UseGuards(AuthGuard())
    // async verifyUser(user: UserEntity, token: string): Promise<{ username: string }> {
    //     this.jwtService.verify(token).then(res => console.log(res));
    //     return {username: user.username}
    // }

    async findUser(
        userId: number
    ): Promise<UserEntity> {
        return await this.userRepository.findOne({id: userId})
    }
}
