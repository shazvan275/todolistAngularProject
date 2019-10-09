import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
