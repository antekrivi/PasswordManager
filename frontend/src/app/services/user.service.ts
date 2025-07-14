import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: any = null;

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
   }

  setUser(user: any) {
    this.user = user;
  }
  getUser() {
    return this.user;
  }
  clearUser() {
    this.user = null;
  }
  
}
