import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterData } from '../models/RegisterData';
import { LoginData } from '../models/LoginData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API = 'https://localhost:5000/auth';

  constructor(private http: HttpClient) { }

  login(data: LoginData) : Observable<Object> {
    console.log("Logging in user:");
    return this.http.post(`${this.API}/login`, data, {
      withCredentials: true
    });
  }

  register(data: RegisterData): Observable<Object> {
    console.log("Registering user:");
    return this.http.post(`${this.API}/register`, data, {
      withCredentials: true
    });
  }
  refresh(): Observable<HttpResponse<any>> {
    console.log("Refreshing token...");
    return this.http.get(`${this.API}/refresh`, {
      withCredentials: true,
      observe: 'response'
    });
  }

  logout(): void {
    this.http.post(`${this.API}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        
        console.log("Odjavljen korisnik.");
      },
      error: (err) => {
        console.error("Greška pri odjavi:", err);
      }
    });
  }
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.API}/me`, { withCredentials: true });
  }
  
}
