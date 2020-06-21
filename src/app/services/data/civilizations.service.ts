import { Injectable } from '@angular/core';
import { CivilizationDto } from '../../dto/civilization/civilization-dto';
import { Observable, BehaviorSubject } from 'rxjs';
import { PirosApiService } from '@piros/api';
import { AuthService, AuthStatus } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CivilizationsService {

  private civilization: BehaviorSubject<CivilizationDto> = new BehaviorSubject(null);
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private api: PirosApiService,
    private authService: AuthService
  ) {
    this.authService.getStatus().subscribe((status) => {
      if (status === AuthStatus.SESSION_STARTED) {
        this.api.request<CivilizationDto>('civilizations.get-civilization').subscribe(civilization => {
          this.civilization.next(civilization);
          this.loaded.next(true);
        }, (err) => {
          console.log(err);
        });

        this.api.connectToChannel<CivilizationDto>('create-civilization').subscribe((channelConnection) => {
          channelConnection.messages.subscribe(message => {
            this.civilization.next(message);
          });
        });

      } else {
        this.civilization.next(null);
        this.loaded.next(false);
      }
    });
  }

  public isLoaded(): Observable<boolean> {
    return this.loaded.asObservable();
  }

  public getCivilization(): Observable<CivilizationDto> {
    return this.civilization.asObservable();
  }

  public createCivilization(name: string): Observable<string> {
    return this.api.request<string>('create-civilization', name);
  }
}
