import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { VaultEntry } from '../../models/VaultEntry';

import argon2 from 'argon2';
import { VaultService } from '../../services/vault.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vault',
  standalone: false,
  templateUrl: './vault.component.html',
  styleUrl: './vault.component.css'
})
export class VaultComponent implements OnInit{
  
  masterPassword: string = '';
  user: any;
  decryptedEntries: VaultEntry[] = [];
  vaultUnlocked: boolean = false;
  errorMessage: string = '';
  visiblePasswords: { [key: number]: boolean } = {};

  constructor(private vaultService: VaultService,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.user = res.user;
        console.log("Current user:", this.user);
      },
      error: (err) => {
        console.error("Error fetching current user:", err);
        this.router.navigate(['/login']);
      }
    });
  }

  async unlockVault() {   
    try {
      this.vaultService.unlockVault(this.user.email, this.masterPassword).subscribe({
        next: (entries: VaultEntry[]) => {
          this.decryptedEntries = entries;
          this.vaultUnlocked = true;
          this.errorMessage = '';
          console.log("Decrypted entries:", this.decryptedEntries);
        },
        error: (error) => {
          console.error("Greška prilikom otključavanja vaulta:", error);
          this.errorMessage = 'Neuspješno otključavanje vaulta. Provjerite lozinku.';
          this.vaultUnlocked = false;
        }
      });
    } catch (error) {
      console.error("Greška prilikom otključavanja vaulta:", error);
      this.errorMessage = 'Neuspješno otključavanje vaulta. Provjerite lozinku.';
      this.vaultUnlocked = false;
    }
  }

  addEntry(title: string, email: string, password: string, note: string) {
    const vaultEntry: VaultEntry = {
      title: title,
      email: email,
      password: password,
      note: note,
    };
    const payload = {
      email,
      masterPassword: this.masterPassword,
      entry: vaultEntry
    };
    console.log("Adding entry:", payload);
    this.vaultService.addVaultEntry(payload).subscribe({
      next: (response) => {
        console.log("Entry added successfully:", response);
        this.decryptedEntries.push(response);
      },
      error: (error) => {
        console.error("Error adding entry:", error);
        this.errorMessage = 'Neuspješno dodavanje entrija. Provjerite lozinku.';
      }
    });
  }


  togglePasswordVisibility(index: number): void { this.visiblePasswords[index] = !this.visiblePasswords[index];}

  showPassword(index: number): void {this.visiblePasswords[index] = true;}

  hidePassword(index: number): void {this.visiblePasswords[index] = false;}

  isPasswordVisible(index: number): boolean {return this.visiblePasswords[index] || false;}

}