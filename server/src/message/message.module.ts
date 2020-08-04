import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MessageRepository} from "./message.repository";

@Module({
  imports: [
      AuthModule,
      TypeOrmModule.forFeature([MessageRepository])
  ],
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
