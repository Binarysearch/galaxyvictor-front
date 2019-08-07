import { Component, OnInit } from '@angular/core';
import { DsConfig, TopbarPosition } from '@piros/dashboard';
import { RequestService } from './services/request.service';
import { SocketService } from './services/socket.service';
import { ApiService } from './services/api.service';

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
export class AppComponent {

  sessionStartedConfig: DsConfig = {
    routes: [
      { path: '/', title: 'Home', faIcon: 'fas fa-home' },
      { path: '/develop', title: 'Develop', faIcon: 'fas fa-file-code' },
      { path: '/admin', title: 'Admin', faIcon: 'fas fa-tools' },
      { path: '/universe', title: 'Universe', faIcon: 'fab fa-galactic-republic' },
      { path: '/galaxy', title: 'Galaxy', faIcon: 'fa fa-atom' },
      { path: '/civilizations', title: 'Civilizations', faIcon: 'fab fa-galactic-senate' },
      { path: '/colonies', title: 'Colonies', faIcon: 'fas fa-globe' },
      { path: '/fleets', title: 'Fleets', faIcon: 'fas fa-rocket' },
      { path: '/planets', title: 'Planets', faIcon: 'fas fa-globe-europe' },
      { path: '/trade', title: 'Trade', faIcon: 'fas fa-handshake' },
      { path: '/research', title: 'Research', faIcon: 'fas fa-flask' },
      { path: '/battles', title: 'Battles', faIcon: 'fas fa-fighter-jet'  },
      { path: '/login', title: 'Login', faIcon: 'fas fa-sign-in-alt', topbarPosition: TopbarPosition.RIGHT },
      { path: '/register', title: 'Register', faIcon: 'fas fa-user-plus', topbarPosition: TopbarPosition.RIGHT },
    ]
  }

  sessionNotStartedConfig: DsConfig = {
    routes: [
      { path: '/', title: 'Home', faIcon: 'fas fa-home' },
      { path: '/login', title: 'Login', faIcon: 'fas fa-sign-in-alt', topbarPosition: TopbarPosition.RIGHT },
      { path: '/register', title: 'Register', faIcon: 'fas fa-user-plus', topbarPosition: TopbarPosition.RIGHT },
    ]
  }

  config: DsConfig = this.sessionNotStartedConfig;

  constructor(private api: ApiService) {
    api.getReady().subscribe(ready => {
      if (ready) {
        this.config = this.sessionStartedConfig;
      } else {
        this.config = this.sessionNotStartedConfig;
      }
    });
  } 

}
