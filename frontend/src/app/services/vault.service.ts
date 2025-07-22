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
  
  addVaultEntry(body: any): Observable<any> {
    return this.http.post(`${this.API}/new`, body);
  }

  editVaultEntry(masterPassword: string, oldEntry: VaultEntry, newEntry: VaultEntry): Observable<any> {
    const body = {masterPassword, oldEntry, newEntry };
    return this.http.put(`${this.API}/edit`, body);
  }

  deleteVaultEntry(entry: VaultEntry, masterPassword: string): Observable<any> {
    const body = { entry, masterPassword };
    return this.http.delete(`${this.API}/delete`, { body });
  }
}
