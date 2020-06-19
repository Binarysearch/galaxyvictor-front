import { CivilizationDto } from '../dto/civilization/civilization-dto';

export enum Status {
    SESSION_STARTING = 'SESSION_STARTING',
    SESSION_STARTED = 'SESSION_STARTED',
    SESSION_CLOSED = 'SESSION_CLOSED'
}

export interface GvApiServiceStatus {

    sessionStarted: Status;
    civilization?: CivilizationDto;

}