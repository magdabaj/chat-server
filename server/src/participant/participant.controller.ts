import {
    Body,
    Controller,
    Get,
    Logger,
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

@Controller('participants')
@UseGuards(AuthGuard())
export class ParticipantController {
    private logger = new Logger('ParticipantController')
    constructor(private participantService: ParticipantService) {}

    @Get()
    getRooms(
        @Req() req
    ): Promise<ParticipantEntity[]> {
        this.logger.verbose(`User "${req.user.username}" retrieving all rooms.`)
        return this.participantService.getRooms(req.user)
    }

    @Get('/:roomId')
    getParticipants(
        @Param('roomId', ParseIntPipe) roomId,
        @Req() req
    ): Promise<ParticipantEntity[]> {
        this.logger.verbose(`User "${req.user.username}" retrieving all participants.`)
        return this.participantService.getParticipants(roomId, req.user)
    }

    @Post('/:roomId')
    @UsePipes(ValidationPipe)
    createParticipant(
        @Param('roomId', ParseIntPipe) roomId,
        @Body('userId', ParseIntPipe, ValidationPipe) createParticipantDto: CreateParticipantDto,
        @Req() req
    ): Promise<ParticipantEntity> {
        this.logger.verbose(`User "${req.user.username}" creating a new participant with id ${JSON.stringify(createParticipantDto)}. Data: ${JSON.stringify(roomId)} `)
        return this.participantService.createParticipant(roomId, createParticipantDto, req.user)
    }
}
