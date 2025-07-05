import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post(`${this.API}/login`, { email, password });
  }

  register(email: string, password: string) {
    return this.http.post(`${this.API}/register`, { email, password });
  }
}
