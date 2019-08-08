import { Component } from '@angular/core';
import { DsConfig, TopbarPosition } from '@piros/dashboard';
import { ApiService } from './services/api.service';
import { AuthService } from './modules/auth/services/auth.service';

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

  constructor(private api: ApiService, private auth: AuthService) {
    api.getReady().subscribe(ready => {
      this.sessionStarted = ready;
    });
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
}
