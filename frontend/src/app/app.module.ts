import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule,} from '@angular/common/http';
import { VaultComponent } from './components/vault/vault.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NavigationComponent } from './components/partials/navigation/navigation.component';
import { VaultEntryComponent } from './components/partials/vault-entry/vault-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    VaultComponent,
    NavigationComponent,
    RegisterComponent,
    VaultEntryComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
    
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  exports: [
    ReactiveFormsModule
  ]
})
export class AppModule { }
