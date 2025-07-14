import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VaultEntry } from '../models/VaultEntry';

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  private API = 'https://localhost:5000/auth/vault';
  constructor(private http: HttpClient) { }

  unlockVault(email: string, masterPassword: string) : Observable<VaultEntry[]> {
    const body = { email, masterPassword };
    return this.http.post<VaultEntry[]>(`${this.API}`, body);
  }
  

}
