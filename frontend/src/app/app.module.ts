import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule,  } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterComponent,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    ReactiveFormsModule
  ]
})
export class AppModule { }
