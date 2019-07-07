import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'galaxyvictor';

  routes = [
    { link: '/', title: 'Home'},
    { link: '/develop', title: 'Develop'},
    { link: '/admin', title: 'Admin'},
    { link: '/login', title: 'Login'},
    { link: '/register', title: 'Register'},
  ];

  constructor(){}

  ngOnInit(){ }

}
