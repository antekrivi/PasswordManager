import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { VaultComponent } from './components/vault/vault.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {component: HomeComponent, path: '', pathMatch: 'full', data: { title: 'Home' }},
  {component: LoginComponent, path: 'login', data: { title: 'Login' }},
  {component: RegisterComponent, path: 'register', canActivate: [authGuard], data: { title: 'Register' }},
  {component: VaultComponent, path: 'vault', canActivate: [authGuard], data: { title: 'Vault' }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
