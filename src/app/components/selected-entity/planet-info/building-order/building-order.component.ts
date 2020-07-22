import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BuildingOrder } from '../../../../model/building-order';

@Component({
  selector: 'app-building-order',
  templateUrl: './building-order.component.html',
  styleUrls: ['./building-order.component.css']
})
export class BuildingOrderComponent implements OnInit, OnDestroy {

  @Input() buildingOrder: BuildingOrder;
  interval: NodeJS.Timeout;
  progress: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.calculateProgress();
    this.interval = setInterval(() => {
      this.calculateProgress();
    }, 30);
  }

  private calculateProgress(): void {
    const now = Date.now();
    const totalTime = this.buildingOrder.endTime - this.buildingOrder.startedTime;
    const timeAdvanced = now - this.buildingOrder.startedTime;
    this.progress = Math.round(100 * timeAdvanced / totalTime);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

}
