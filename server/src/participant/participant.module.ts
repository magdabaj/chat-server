import { Module } from '@nestjs/common';
import {ParticipantController} from "./participant.controller";

@Module({
    providers: [ParticipantModule],
    controllers: [ParticipantController]
})
export class ParticipantModule {
}
