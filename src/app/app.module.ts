import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { DashboardModule } from '@piros/dashboard';
import { EndPointService } from './services/end-point.service';
import { AuthService } from './modules/auth/services/auth.service';
import { SocketService, SocketStatus } from './services/socket.service';
import { first } from 'rxjs/operators';

export function initializer(
    endPointService: EndPointService,
    auth: AuthService,
    socket: SocketService
  ): () => Promise<void> {
  return () => new Promise((resolve) =>{ 
    endPointService.loadEndPoints().then(() => {

      const session = auth.loadFromStorage();

      if (session) {
        auth.setSession(session);
        socket.getStatus().pipe(
          first(status => {
            return status === SocketStatus.SESSION_STARTED || 
            status === SocketStatus.INVALID_SESSION;
          })
        ).subscribe((status) => {
          console.log('RESOLVED');
          resolve();
        });
      } else {
        console.log('RESOLVED');
        resolve();
      }

    });
  });
}

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [ EndPointService, AuthService, SocketService ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
