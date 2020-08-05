import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmConfig} from "./config/typeorm.config";
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { ParticipantModule } from './participant/participant.module';

@Module({
  imports: [
      TypeOrmModule.forRoot(typeOrmConfig),
      AuthModule,
      MessageModule,
      RoomModule,
      ParticipantModule
  ],
})
export class AppModule {}
