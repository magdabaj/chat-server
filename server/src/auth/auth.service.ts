import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";
import {JwtService} from "@nestjs/jwt";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {JwtPayloadInterface} from "./jwt-payload.interface";
import {UserEntity} from "./user.entity";

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService')

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto)

        if (!username) throw new UnauthorizedException('Invalid credentials')

        const payload: JwtPayloadInterface = { username }
        const accessToken = await this.jwtService.sign(payload)

        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`)

        return { accessToken }
    }

    async findUser(
        userId: number
    ): Promise<UserEntity> {
        return await this.userRepository.findOne({id: userId})
    }
}
