import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestLogInterceptor } from './interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFontAwesomeModule

  ],
  providers: [AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestLogInterceptor,
    multi: true
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
