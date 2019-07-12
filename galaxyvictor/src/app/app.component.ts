import { Component, OnInit } from '@angular/core';
import { APP_MAIN_ROUTES } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'galaxyvictor';

  routes = APP_MAIN_ROUTES.map( route => ({ link: `/${route.path}`, title: route.title}));
  

  constructor(){}

  ngOnInit(){ }

}
