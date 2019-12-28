import { Injectable } from '@angular/core';
import { PlanetInfoDto } from 'src/app/dto/planet-info';
import { ChannelConnection, ApiService } from '@piros/api';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanetUpdatesService {

  private connection: ChannelConnection<PlanetInfoDto[]>;
  private planetUpdates: Subject<PlanetInfoDto> = new Subject();

  constructor(
    private api: ApiService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<PlanetInfoDto[]>('planet-updates');
          this.connection.observable.subscribe(planets => {
            planets.forEach(planet => this.planetUpdates.next(planet));
          });
        }
      }
    );
  }

  public getPlanetUpdates(): Observable<PlanetInfoDto> {
    return this.planetUpdates.asObservable();
  }
}
