import { BuildingOrderDto, FinishedBuildingOrderDto } from './building-order-dto';

export interface BuildingOrdersNotificationDto {

    buildingOrders: BuildingOrderDto[];
    finishedBuildingOrders: FinishedBuildingOrderDto[];
     
}