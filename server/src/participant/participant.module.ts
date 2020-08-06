import { Module } from '@nestjs/common';
import {ParticipantController} from "./participant.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ParticipantRepository} from "./participant.repository";
import {AuthModule} from "../auth/auth.module";
import {ParticipantService} from "./participant.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ParticipantRepository]),
        AuthModule
    ],
    providers: [ParticipantService],
    controllers: [ParticipantController],
    exports: [
        ParticipantService,
    ]
})
export class ParticipantModule {
}
