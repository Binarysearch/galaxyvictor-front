export interface FleetInfoDto {
    id: string;
    civilizationId: string;
    originId: string;
    destinationId: string;
    startTravelTime: number;
    acceleration: number;
    shipCount: number;
}