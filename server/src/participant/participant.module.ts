import { Module } from '@nestjs/common';
import {ParticipantController} from "./participant.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ParticipantRepository} from "./participant.repository";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ParticipantRepository]),
        AuthModule
    ],
    providers: [ParticipantModule],
    controllers: [ParticipantController]
})
export class ParticipantModule {
}
