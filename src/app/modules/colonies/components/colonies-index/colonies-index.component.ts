import { Component, OnInit } from '@angular/core';
import { TableConfig, DataSource, QueryParams, QueryResult, Order } from '@piros/table';
import { Store } from '../../../../services/data/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NameRenderComponent } from './renders/name-render/name-render.component';
import { Colony } from 'src/app/model/colony';
import { ColoniesService } from 'src/app/services/data/colonies.service';

@Component({
  selector: 'app-colonies-index',
  templateUrl: './colonies-index.component.html',
  styleUrls: ['./colonies-index.component.css']
})
export class ColoniesIndexComponent implements OnInit {

  config: TableConfig<Colony>;
  
  constructor(
    private coloniesService: ColoniesService
  ) { }

  ngOnInit() {
    this.config = {
      columnDefs: [
        { id: 'name', cellRenderer: NameRenderComponent, name: 'Nombre', sortable: true }
      ],
      dataSource: new ColonyDataSource(this.coloniesService),
      pagination: false,
      tableClasses: ['gv-table']
    };
  }

}

class ColonyDataSource implements DataSource<Colony> {
  
  private sortFunctions = {
    'name': (a, b) => a.name.localeCompare(b.name)
  }

  constructor(private coloniesService: ColoniesService) {
    
  }

  connect(paramsChange: Observable<QueryParams>): Observable<QueryResult<Colony>> {
    return paramsChange.pipe(
      switchMap(params => {
        return this.coloniesService.getColonies().pipe(map(colonySet => {
          let colonies = Array.from(colonySet).filter(c => c.civilization.playerCivilization);
          if (params && params.sortStatus) {
            const reverseSortStatus = Array.from(params.sortStatus);
            reverseSortStatus.reverse();
            reverseSortStatus.forEach(sortStatus => {
              if (sortStatus.order === Order.ASC) {
                colonies.sort(this.sortFunctions[sortStatus.field]);
              } else {
                colonies.sort((a, b) => { return this.sortFunctions[sortStatus.field](b, a) });
              }
            });
          }
          return { data: colonies, total: colonies.length };
        }))
      })
    );
  }

}