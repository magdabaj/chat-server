import {
    Body,
    Controller,
    Get,
    Logger,
    Param, ParseIntPipe,
    Post,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {RoomService} from "./room.service";
import {GetRoomsFilterDto} from "./dto/get-rooms-filter.dto";
import {RoomEntity} from "./room.entity";
import {CreateRoomDto} from "./dto/create-room.dto";
import {ParticipantService} from "../participant/participant.service";
import {ParticipantEntity} from "../participant/participant.entity";

@Controller('room')
@UseGuards(AuthGuard())
export class RoomController {
    private logger = new Logger('RoomController')
    constructor(
        private roomService: RoomService,
        private participantService: ParticipantService
    ) {}

    @Get()
    getRooms(
        @Query(ValidationPipe) filterDto: GetRoomsFilterDto,
        @Req() req,
    ): Promise<RoomEntity[]> {
        this.logger.verbose(`User "${req.user.username}" retrieving all rooms. ${JSON.stringify(filterDto)}`)
        // const authorised = this.participantService.getParticipantsForRoom()
        return this.roomService.getRooms(filterDto, req.user)
    }

    @Get('/:roomId')
    getOneRoom(
        @Req() req,
        @Param('roomId', ParseIntPipe) roomId: number
    ): Promise<RoomEntity> {
        this.logger.verbose(`User "${req.user.username}" retrieving room with id ${roomId}.`)
        // const authorised = this.participantService.getParticipantsForRoom()
        return this.roomService.getOneRoom(req.user, roomId)
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createRoom(
        @Body() createRoomDto: CreateRoomDto,
        @Req() req
    ): Promise<Object> {
        this.logger.verbose(`User "${req.user.username}" creating a new room and participant. Data: ${JSON.stringify(createRoomDto)} `)
        const room = await this.roomService.createRoom(createRoomDto, req.user)
        const participant = await this.participantService.createFirstParticipant(req.user, room.id )
        return {room, participant}
    }
}
