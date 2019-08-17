import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, ViewChildren, QueryList, HostListener } from '@angular/core';
import { DsConfig, TopbarPosition } from '@piros/dashboard';
import { ApiService } from './services/api.service';
import { AuthService } from './modules/auth/services/auth.service';
import { MainRendererService } from './services/render/main-renderer.service';
import { GalaxyMapService } from './services/galaxy-map.service';
import { RenderContext } from './services/render/renderer.interface';

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
export class AppComponent implements AfterViewInit{

  @ViewChildren('canvasRef') 
  private canvasRef: QueryList<ElementRef>;
  
  private sessionStarted: boolean = false;

  config: DsConfig = {
    routes: [
      { path: '/', title: 'Home', faIcon: 'fas fa-home' },
      { path: '/develop', title: 'Develop', faIcon: 'fas fa-file-code', show: this.isSessionStarted.bind(this) },
      { path: '/admin', title: 'Admin', faIcon: 'fas fa-tools', show: this.isSessionStarted.bind(this) },
      { path: '/universe', title: 'Universe', faIcon: 'fab fa-galactic-republic', show: this.isSessionStarted.bind(this) },
      { path: '/galaxy', title: 'Galaxy', faIcon: 'fa fa-atom', show: this.isSessionStarted.bind(this) },
      { path: '/civilizations', title: 'Civilizations', faIcon: 'fab fa-galactic-senate', show: this.isSessionStarted.bind(this) },
      { path: '/colonies', title: 'Colonies', faIcon: 'fas fa-globe', show: this.isSessionStarted.bind(this) },
      { path: '/fleets', title: 'Fleets', faIcon: 'fas fa-rocket', show: this.isSessionStarted.bind(this) },
      { path: '/planets', title: 'Planets', faIcon: 'fas fa-globe-europe', show: this.isSessionStarted.bind(this) },
      { path: '/trade', title: 'Trade', faIcon: 'fas fa-handshake', show: this.isSessionStarted.bind(this) },
      { path: '/research', title: 'Research', faIcon: 'fas fa-flask', show: this.isSessionStarted.bind(this) },
      { path: '/battles', title: 'Battles', faIcon: 'fas fa-fighter-jet', show: this.isSessionStarted.bind(this)  },
      { onClick: this.logout.bind(this), title: 'Logout', faIcon: 'fas fa-sign-out-alt', topbarPosition: TopbarPosition.RIGHT, show: this.isSessionStarted.bind(this) },
      { path: '/login', title: 'Login', faIcon: 'fas fa-sign-in-alt', topbarPosition: TopbarPosition.RIGHT, show: this.isNotSessionStarted.bind(this) },
      { path: '/register', title: 'Register', faIcon: 'fas fa-user-plus', topbarPosition: TopbarPosition.RIGHT, show: this.isNotSessionStarted.bind(this) },
    ]
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private galaxyMap: GalaxyMapService
  ) {
    api.getReady().subscribe(ready => {
      this.sessionStarted = ready;
    });
  } 

  ngAfterViewInit(): void {
    this.galaxyMap.setCanvas(<HTMLCanvasElement>this.canvasRef.first.nativeElement);
  }

  private isSessionStarted(): boolean {
    return this.sessionStarted;
  }

  private isNotSessionStarted(): boolean {
    return !this.sessionStarted;
  }

  private logout(): void {
    this.auth.closeSession();
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
    event.preventDefault();
  }

}
