import { Component, OnInit } from '@angular/core';
import { TableConfig, DataSource, QueryParams, QueryResult, Order } from '@piros/table';
import { Fleet } from '../../../../model/fleet';
import { Store } from '../../../../services/data/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StarSystemRenderComponent } from './renders/star-system-render/star-system-render.component';
import { CivilizationRenderComponent } from './renders/civilization-render/civilization-render.component';
import { StatusRenderComponent } from './renders/status-render/status-render.component';
import { NameRenderComponent } from './renders/name-render/name-render.component';

@Component({
  selector: 'app-fleets-index',
  templateUrl: './fleets-index.component.html',
  styleUrls: ['./fleets-index.component.css']
})
export class FleetsIndexComponent implements OnInit {

  config: TableConfig<Fleet>;
  
  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    this.config = {
      columnDefs: [
        { id: 'name', cellRenderer: NameRenderComponent, name: 'Nombre', sortable: true },
        { id: 'civilization', cellRenderer: CivilizationRenderComponent, name: 'Civilización', sortable: true },
        { id: 'status', cellRenderer: StatusRenderComponent, name: 'Estado', sortable: true },
        { id: 'destination', cellRenderer: StarSystemRenderComponent, name: 'Destino', sortable: true }
      ],
      dataSource: new FleetDataSource(this.store),
      pagination: false,
      tableClasses: ['gv-table']
    };
  }

}

class FleetDataSource implements DataSource<Fleet> {
  
  private sortFunctions = {
    'name': (a, b) => a.name.localeCompare(b.name),
    'civilization': (a, b) => a.civilization.name.localeCompare(b.civilization.name),
    'destination': (a, b) => a.destination.name.localeCompare(b.destination.name)
  }

  constructor(private store: Store) {
    
  }

  connect(paramsChange: Observable<QueryParams>): Observable<QueryResult<Fleet>> {
    paramsChange.subscribe();

    return paramsChange.pipe(
      switchMap(params => {
        return this.store.getFleets().pipe(map(FleetSet => {
          let fleets = Array.from(FleetSet);
          if (params && params.sortStatus) {
            const reverseSortStatus = Array.from(params.sortStatus);
            reverseSortStatus.reverse();
            reverseSortStatus.forEach(sortStatus => {
              if (sortStatus.order === Order.ASC) {
                fleets.sort(this.sortFunctions[sortStatus.field]);
              } else {
                fleets.sort((a, b) => { return this.sortFunctions[sortStatus.field](b, a) });
              }
            });
          }
          
          return { data: fleets, total: fleets.length };
        }))
      })
    );
  }

}