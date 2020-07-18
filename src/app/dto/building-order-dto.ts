export interface BuildingOrderDto {

    id: string;
    type: BuildingOrderType;
    colonyId: string;
    startedTime: number;
    endTime: number;

}

export enum BuildingOrderType {
    SHIP = 'SHIP'
}