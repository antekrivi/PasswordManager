import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterData } from '../models/RegisterData';
import { LoginData } from '../models/LoginData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) { }

  login(data: LoginData) {
    return this.http.post(`${this.API}/login`, data);
  }

  register(data: RegisterData): Observable<Object> {
    console.log("Registering user:", data);
    return this.http.post(`${this.API}/register`, data );
  }
}
