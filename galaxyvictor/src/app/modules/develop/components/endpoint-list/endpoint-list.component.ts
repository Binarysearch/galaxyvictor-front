import { Component, OnInit } from '@angular/core';
import { ApiInfo, EndPointService } from 'src/app/services/end-point.service';

@Component({
  selector: 'app-endpoint-list',
  templateUrl: './endpoint-list.component.html',
  styleUrls: ['./endpoint-list.component.css']
})
export class EndpointListComponent implements OnInit {

  apiInfo: ApiInfo;

  constructor(private endPoint: EndPointService) { }

  ngOnInit() {
    this.endPoint.getApiInfo().subscribe( apiInfo => this.apiInfo = apiInfo);
  }

}
