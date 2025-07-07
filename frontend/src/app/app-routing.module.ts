import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {component: HomeComponent, path: '', pathMatch: 'full'},
  {component: LoginComponent, path: 'login'},
  {component: RegisterComponent, path: 'register'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
