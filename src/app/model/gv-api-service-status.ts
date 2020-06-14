import { StarSystemInfoDto } from '../dto/star-system-info';

export interface GvApiServiceStatus {

    sessionStarted: boolean;
    stars?: StarSystemInfoDto[];

}