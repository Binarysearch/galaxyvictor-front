import { Component, OnInit } from '@angular/core';
import { EndPointService, AppInfo, ApiInfo } from './services/end-point.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'galaxyvictor';
  appInfo: AppInfo;
  apiInfo: ApiInfo;

  constructor(private endPoint: EndPointService){}

  ngOnInit(){
    this.endPoint.getAppInfo().subscribe( appInfo => this.appInfo = appInfo);
    this.endPoint.getApiInfo().subscribe( apiInfo => this.apiInfo = apiInfo);
  }

}
