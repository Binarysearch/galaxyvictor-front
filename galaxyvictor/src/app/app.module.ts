import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { DashboardModule } from '@binarysearch/dashboard';
import { EndPointService } from './services/end-point.service';

export function initializer(endPointService: EndPointService): ()=>void {
  return () => endPointService.loadEndPoints();
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
      deps: [ EndPointService ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
