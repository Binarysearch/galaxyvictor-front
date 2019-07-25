import { Component, OnInit } from '@angular/core';
import { ApiInfo, EndPointService, Endpoint } from 'src/app/services/end-point.service';
import { CrudTableConfig, CrudTableDataSource, QueryParams, QueryResult, QueryOrder, Order } from '@binarysearch/crud-tables';
import { Observable, Subject } from 'rxjs';

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

export class LocalDataSource<T> implements CrudTableDataSource<T>{

  private subject: Subject<QueryResult<T>> = new Subject();

  constructor(private data: T[]) {}

  connect(paramsChange: Observable<QueryParams>): Observable<QueryResult<T>> {
    paramsChange.subscribe(params => {
            const data = [ ...this.data ].sort(this.getSortFunc(params.sortStatus));
            this.subject.next({ total: this.data.length, data: data.slice(params.start, params.end)});
        });
        return this.subject.asObservable();
  }

  getSortFunc(order: QueryOrder[]): ((e1: T, e2: T) => number) {
    if (order && order.length > 0) {
        const actualOrder = order[0];
        return (e1: T, e2: T) => {
            const result = (e1[actualOrder.field] + '')
                .localeCompare(e2[actualOrder.field]);
            if (result === 0 && order.length > 1) {
                const func = this.getSortFunc(order.slice(1, order.length));
                return func.call(this, e1, e2);
            }
            if (actualOrder.order === Order.ASC) {
                return result;
            }
            return result * -1;
        }
    }
    return () => 0;
  }
}