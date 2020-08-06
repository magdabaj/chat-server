import {
    Body,
    Controller,
    Get,
    Logger, NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {ParticipantService} from "./participant.service";
import {ParticipantEntity} from "./participant.entity";
import {CreateParticipantDto} from "./dto/create-participant.dto";
import {AuthService} from "../auth/auth.service";

@Controller('participants')
@UseGuards(AuthGuard())
export class ParticipantController {
    private logger = new Logger('ParticipantController')
    constructor(
        private participantService: ParticipantService,
        private authService: AuthService
        ) {}

    @Get('/:roomId')
    getParticipants(
        @Param('roomId', ParseIntPipe) roomId,
        @Req() req
    ): Promise<ParticipantEntity[]> {
        this.logger.verbose(`User "${req.user.username}" retrieving all participants for room ${roomId}.`)
        return this.participantService.getParticipants(roomId, req.user)
    }

    @Post('/:roomId')
    @UsePipes(ValidationPipe)
    async createParticipant(
        @Param('roomId', ParseIntPipe) roomId,
        @Body('userId',ParseIntPipe) userId: number,
        @Req() req
    ): Promise<ParticipantEntity> {
        const found = await this.authService.findUser(userId)

        if (!found) throw new NotFoundException(`User with id ${userId} not found`)

        this.logger.verbose(`User "${req.user.username}" creating a new participant with userId ${JSON.stringify(userId)}. Room id: ${JSON.stringify(roomId)} `)
        return this.participantService.createParticipant(req.user, userId, roomId)
    }
}
