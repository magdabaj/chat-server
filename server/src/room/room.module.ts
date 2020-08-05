import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoomRepository} from "./room.repository";
import {AuthModule} from "../auth/auth.module";
import {ParticipantRepository} from "../participant/participant.repository";
import {ParticipantModule} from "../participant/participant.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([RoomRepository]),
      AuthModule,
  ],
  providers: [RoomService],
  controllers: [RoomController]
})
export class RoomModule {}
