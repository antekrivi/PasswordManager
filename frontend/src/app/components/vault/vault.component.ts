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
  
  email: string = '';
  masterPassword: string = '';
  user: any;
  decryptedEntries: VaultEntry[] = [];
  vaultUnlocked: boolean = false;
  errorMessage: string = '';
  visiblePasswords: { [key: number]: boolean } = {};

  editIndex: number | null = null;
  editingEntry: VaultEntry | null = null;
  entryToDeleteIndex: number | null = null;


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
          if(error.status === 401) {
            alert(this.errorMessage);
            this.router.navigate(['/login']);
          }
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
        if(error.status === 401) {
          this.errorMessage = 'Greška pri dodavanju. Molim logirati se ponovo';
          alert(this.errorMessage);
          this.router.navigate(['/login']);
        }
        console.error("Error adding entry:", error);
        this.errorMessage = 'Neuspješno dodavanje entrija. Provjerite lozinku.';
      }
    });
  }
  
  openEditModal(entry: VaultEntry, index: number) {
    this.editingEntry = { ...entry };
    this.editIndex = index;
  }

  closeEditModal() {
    this.editingEntry = null;
    this.editIndex = null;
  }

  saveEditedEntry(edited: VaultEntry) {
    if (this.editIndex !== null) {
      const oldEntry : VaultEntry = this.decryptedEntries[this.editIndex];
      this.vaultService.editVaultEntry(this.masterPassword, oldEntry, edited).subscribe({
        next: () => {
          this.decryptedEntries[this.editIndex!] = edited;
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Greška pri uređivanju:', err);
          if(err.status === 401) {
            this.errorMessage = 'Greška pri uređivanju. Molim logirati se ponovo';
            alert(this.errorMessage);
            this.router.navigate(['/login']);
            }
          }
      });
    }
  }

  confirmDeleteEntry(index: number): void {
    this.entryToDeleteIndex = index;
  }

  cancelDelete(): void {
    this.entryToDeleteIndex = null;
  }

  deleteEntry(index: number): void {
    const entry = this.decryptedEntries[index];

    this.vaultService.deleteVaultEntry(entry, this.masterPassword).subscribe({
      next: () => {
        this.decryptedEntries.splice(index, 1);
        this.entryToDeleteIndex = null;
      },
      error: (err) => {
        console.error('Greška pri brisanju:', err);
        this.entryToDeleteIndex = null;
        if(err.status === 401) {
          this.errorMessage = 'Greška pri brisanju. Molim logirati se ponovo';
          alert(this.errorMessage);
          this.router.navigate(['/login']);
        }
      }
    });
  }


  togglePasswordVisibility(index: number): void { this.visiblePasswords[index] = !this.visiblePasswords[index];}

  showPassword(index: number): void {this.visiblePasswords[index] = true;}

  hidePassword(index: number): void {this.visiblePasswords[index] = false;}

  isPasswordVisible(index: number): boolean {return this.visiblePasswords[index] || false;}

}