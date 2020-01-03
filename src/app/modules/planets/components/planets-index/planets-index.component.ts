import { Component, OnInit } from '@angular/core';
import { TableConfig, DataSource, QueryParams, QueryResult, Order } from '@piros/table';
import { Planet } from '../../../../model/planet';
import { Store } from '../../../../services/data/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TypeRenderComponent } from './renders/type-render/type-render.component';
import { SizeRenderComponent } from './renders/size-render/size-render.component';
import { StarSystemRenderComponent } from './renders/star-system-render/star-system-render.component';
import { NameRenderComponent } from './renders/name-render/name-render.component';

@Component({
  selector: 'app-planets-index',
  templateUrl: './planets-index.component.html',
  styleUrls: ['./planets-index.component.css']
})
export class PlanetsIndexComponent implements OnInit {

  config: TableConfig<Planet>;
  
  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    this.config = {
      columnDefs: [
        { id: 'name', name: 'Nombre', cellRenderer: NameRenderComponent, sortable: true },
        { id: 'type', name: 'Tipo', cellRenderer: TypeRenderComponent, sortable: true },
        { id: 'size', name: 'Tamaño', cellRenderer: SizeRenderComponent, sortable: true },
        { id: 'orbit', name: 'Orbita', sortable: true },
        { id: 'starSystem', name: 'Sistema', cellRenderer: StarSystemRenderComponent, sortable: true }
      ],
      dataSource: new PlanetDataSource(this.store),
      pagination: false,
      tableClasses: ['gv-table']
    };
  }

}

class PlanetDataSource implements DataSource<Planet> {
  
  private sortFunctions = {
    'name': (a, b) => a.name.localeCompare(b.name),
    'type': (a, b) => a.type.id - b.type.id,
    'size': (a, b) => a.size.id - b.size.id,
    'starSystem': (a, b) => a.starSystem.name.localeCompare(b.starSystem.name),
    'orbit': (a, b) => a.orbit - b.orbit
  }

  private planets: Planet[] = [];

  constructor(private store: Store) {
    
  }

  connect(paramsChange: Observable<QueryParams>): Observable<QueryResult<Planet>> {
    paramsChange.subscribe();

    return paramsChange.pipe(
      switchMap(params => {
        return this.store.getPlanets().pipe(map(planetSet => {
          let planets = Array.from(planetSet).filter(p => p.colony === undefined || p.colony === null);
          if (params && params.sortStatus) {
            const reverseSortStatus = Array.from(params.sortStatus);
            reverseSortStatus.reverse();
            reverseSortStatus.forEach(sortStatus => {
              if (sortStatus.order === Order.ASC) {
                planets.sort(this.sortFunctions[sortStatus.field]);
              } else {
                planets.sort((a, b) => { return this.sortFunctions[sortStatus.field](b, a) });
              }
            });
          }
          
          return { data: planets, total: planets.length };
        }))
      })
    );
  }

}