import { Component, OnInit } from '@angular/core';
import { ApiInfo, EndPointService, Endpoint } from '../../../../services/end-point.service';
import { TableConfig, LocalDataSource } from '@piros/table';

@Component({
  selector: 'app-endpoint-list',
  templateUrl: './endpoint-list.component.html',
  styleUrls: ['./endpoint-list.component.css']
})
export class EndpointListComponent implements OnInit {

  apiInfo: ApiInfo;

  config: TableConfig<Endpoint>;

  constructor(private endPoint: EndPointService) { }

  ngOnInit() {
    this.apiInfo = this.endPoint.getApiInfo();
    this.config = {
      columnDefs: [
        { id: 'id', name: 'Id', sortable: true },
        { id: 'path', name: 'Path', sortable: true }
      ],
      dataSource: new LocalDataSource<Endpoint>(this.apiInfo.endpoints)
    };
  }

}
