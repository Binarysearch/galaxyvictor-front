import { StarSystemInfoDto } from '../dto/star-system-info';
import { CivilizationDto } from '../dto/civilization/civilization-dto';

export interface GvApiServiceStatus {

    sessionStarted: boolean;
    stars?: StarSystemInfoDto[];
    civilization?: CivilizationDto;

}