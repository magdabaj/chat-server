import {Body, Controller, Get, Logger, Post, Query, Req, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {RoomService} from "./room.service";
import {GetRoomsFilterDto} from "./dto/get-rooms-filter.dto";
import {RoomEntity} from "./room.entity";
import {CreateRoomDto} from "./dto/create-room.dto";

@Controller('room')
@UseGuards(AuthGuard())
export class RoomController {
    private logger = new Logger('RoomController')
    constructor(private roomService: RoomService) {}

    @Get()
    getRooms(
        @Query(ValidationPipe) filterDto: GetRoomsFilterDto,
        @Req() req,
    ): Promise<RoomEntity[]> {
        this.logger.verbose(`User "${req.user.username}" retrieving all rooms. ${JSON.stringify(filterDto)}`)
        return this.roomService.getRooms(filterDto, req.user)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createRoom(
        @Body() createRoomDto: CreateRoomDto,
        @Req() req
    ): Promise<RoomEntity> {
        this.logger.verbose(`User "${req.user.username}" creating a new room. Data: ${JSON.stringify(createRoomDto)} `)
        return this.roomService.createRoom(createRoomDto, req.user)
    }
}
