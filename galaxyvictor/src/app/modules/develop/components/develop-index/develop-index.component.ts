import { Component, OnInit } from '@angular/core';
import { EndPointService, AppInfo } from 'src/app/services/end-point.service';

@Component({
  selector: 'app-develop-index',
  templateUrl: './develop-index.component.html',
  styleUrls: ['./develop-index.component.css']
})
export class DevelopIndexComponent implements OnInit {

  appInfo: AppInfo;
  
  constructor(private endPoint: EndPointService) { }

  ngOnInit() {
    this.appInfo = this.endPoint.getAppInfo();
  }

}
