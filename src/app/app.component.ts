import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, HostListener, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { DsConfig, TopbarPosition } from '@piros/dashboard';
import { GalaxyMapService } from './services/galaxy-map.service';
import { Store } from './services/data/store';
import { Civilization } from './model/civilization';
import { EventManagerService } from './services/events/event-manager.service';
import { WindowManagerService } from './services/window-manager.service-abstract';
import { GvApiService } from './services/gv-api.service';
import { Status } from './model/gv-api-service-status';
import { CivilizationsService } from './services/data/civilizations.service';
import { CivilizationDto } from './dto/civilization/civilization-dto';
import { AuthService, AuthStatus } from './services/auth.service';

export interface AppRoute {
  path: string;
  title: string;
  faIcon?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {

  @ViewChildren('canvasRef') 
  private canvasRef: QueryList<ElementRef>;
  
  public sessionStarted: AuthStatus;
  public showCreateCivilization: boolean;

  public civilization: CivilizationDto;

  config: DsConfig = {
    routes: [
      { path: '/', title: 'Home', faIcon: 'fas fa-home' },
      { path: '/admin', title: 'Admin', faIcon: 'fas fa-tools', show: this.isSessionStarted.bind(this) },
      { path: '/universe', title: 'Universe', faIcon: 'fab fa-galactic-republic', show: this.isSessionStarted.bind(this) },
      { path: '/galaxy', title: 'Galaxy', faIcon: 'fa fa-atom', show: this.isSessionStarted.bind(this) },
      { path: '/civilizations', title: 'Civilizations', faIcon: 'fab fa-galactic-senate', show: this.isSessionStarted.bind(this) },
      { onClick: () => this.windowManagerService.openColonyListWindow(), title: 'Colonies', faIcon: 'fas fa-globe', show: this.isSessionStarted.bind(this) },
      { onClick: () => this.windowManagerService.openFleetsListWindow(), title: 'Fleets', faIcon: 'fas fa-rocket', show: this.isSessionStarted.bind(this) },
      { onClick: () => this.windowManagerService.openPlanetListWindow(), title: 'Planets', faIcon: 'fas fa-globe-europe', show: this.isSessionStarted.bind(this) },
      { path: '/trade', title: 'Trade', faIcon: 'fas fa-handshake', show: this.isSessionStarted.bind(this) },
      { path: '/research', title: 'Research', faIcon: 'fas fa-flask', show: this.isSessionStarted.bind(this) },
      { path: '/battles', title: 'Battles', faIcon: 'fas fa-fighter-jet', show: this.isSessionStarted.bind(this)  },
      { onClick: this.logout.bind(this), title: 'Logout', faIcon: 'fas fa-sign-out-alt', topbarPosition: TopbarPosition.RIGHT, show: this.isSessionStarted.bind(this) },
      { path: '/login', title: 'Login', faIcon: 'fas fa-sign-in-alt', topbarPosition: TopbarPosition.RIGHT, show: this.isSessionClosed.bind(this) },
      { path: '/register', title: 'Register', faIcon: 'fas fa-user-plus', topbarPosition: TopbarPosition.RIGHT, show: this.isSessionClosed.bind(this) },
    ]
  }

  constructor(
    private api: GvApiService,
    private authService: AuthService,
    private civilizationsService: CivilizationsService,
    private galaxyMap: GalaxyMapService,
    private store: Store,
    private eventManagerService: EventManagerService,
    private windowManagerService: WindowManagerService
  ) {
    this.authService.getStatus().subscribe(
      status => {
        this.sessionStarted = status;
      }
    );
    civilizationsService.isLoaded().subscribe(
      loaded => {
        if (loaded) {
          this.civilizationsService.getCivilization().subscribe(
            civ => {
              this.civilization = civ;
              if (civ) {
                this.showCreateCivilization = false;
              } else {
                this.showCreateCivilization = true;
              }
            }
          );
        }
      }
    );
    this.galaxyMap.getOnSelectEntity().subscribe(selected => {
      this.requestCloseWindows();
    });
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.galaxyMap.setCanvas(<HTMLCanvasElement>this.canvasRef.first.nativeElement);
  }

  private isSessionStarted(): boolean {
    return this.sessionStarted === AuthStatus.SESSION_STARTED;
  }

  private isSessionClosed(): boolean {
    return this.sessionStarted === AuthStatus.SESSION_CLOSED;
  }

  private logout(): void {
    this.authService.closeSession();
    this.store.clear();
  }

  @HostListener('window:resize')
  onResize() {
    this.galaxyMap.onResize();
  }

  @HostListener('window:mousemove', ['$event'])
  windowMouseMove(event: MouseEvent) {
    this.galaxyMap.onMouseMove(event);;
  }

  onMouseWheel(event: MouseWheelEvent){
    this.galaxyMap.onMouseWheel(event);
    event.preventDefault();
  }

  onMouseClick(event){
    this.galaxyMap.onMouseClick(event);
  }

  onMouseDown(event){
    this.galaxyMap.onMouseDown(event);
  }

  @HostListener('window:mouseup', ['$event'])
  windowMouseUp(event: MouseEvent) {
    this.galaxyMap.onMouseUp(event);
  }

  onContextMenu(event){
    this.galaxyMap.onRightButtonMouseClick(event);
    event.preventDefault();
  }

  isHovering(): boolean {
    return this.galaxyMap.hovered != null;
  }

  requestCloseWindows() {
    this.windowManagerService.closeAll();
  }

  get openWindow() {
    return this.windowManagerService.getOpenWindow();
  }
}
