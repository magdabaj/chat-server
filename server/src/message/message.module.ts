import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MessageRepository} from "./message.repository";
import {ParticipantService} from "../participant/participant.service";
import {ParticipantModule} from "../participant/participant.module";
import {ParticipantRepository} from "../participant/participant.repository";

@Module({
  imports: [
      AuthModule,
      TypeOrmModule.forFeature([MessageRepository]),
      ParticipantModule
  ],
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
