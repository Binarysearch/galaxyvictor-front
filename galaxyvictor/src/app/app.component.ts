import { Component, OnInit } from '@angular/core';
import { SocketService } from './services/socket.service';

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
export class AppComponent implements OnInit{
  
  routes: AppRoute[] = [
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
    { path: '/login', title: 'Login', faIcon: 'fas fa-sign-in-alt' },
    { path: '/register', title: 'Register', faIcon: 'fas fa-user-plus' },
  ];

  constructor(private socket: SocketService){}

  ngOnInit(): void {
    this.socket.getMessages().subscribe(msg => {
      console.log('MESSAGE', msg);
    });
  }

}
