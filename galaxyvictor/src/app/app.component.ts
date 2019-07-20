import { Component, OnInit } from '@angular/core';

export interface AppRoute {
  path: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  routes: AppRoute[] = [
    { path: '/develop', title: 'Develop' },
    { path: '/admin', title: 'Admin' },
    { path: '/universe', title: 'Universe' },
    { path: '/galaxy', title: 'Galaxy' },
    { path: '/civilizations', title: 'Civilizations' },
    { path: '/colonies', title: 'Colonies' },
    { path: '/fleets', title: 'Fleets' },
    { path: '/planets', title: 'Planets' },
    { path: '/trade', title: 'Trade' },
    { path: '/research', title: 'Research' },
    { path: '/battles', title: 'Battles' },
    { path: '/', title: 'Home' }
  ];

  constructor(){}

  ngOnInit(){ }

}
