import { Component, OnInit } from '@angular/core';
import { ApiInfo, EndPointService, Endpoint } from 'src/app/services/end-point.service';
import { CrudTableConfig, LocalDataSource } from '@binarysearch/crud-tables';

@Component({
  selector: 'app-endpoint-list',
  templateUrl: './endpoint-list.component.html',
  styleUrls: ['./endpoint-list.component.css']
})
export class EndpointListComponent implements OnInit {

  apiInfo: ApiInfo;

  config: CrudTableConfig<Endpoint>;

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
