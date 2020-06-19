import { StarSystemInfoDto } from '../dto/star-system-info';
import { CivilizationDto } from '../dto/civilization/civilization-dto';

export enum Status {
    SESSION_STARTING = 'SESSION_STARTING',
    SESSION_STARTED = 'SESSION_STARTED',
    SESSION_CLOSED = 'SESSION_CLOSED'
}

export interface GvApiServiceStatus {

    sessionStarted: Status;
    stars?: StarSystemInfoDto[];
    civilization?: CivilizationDto;

}