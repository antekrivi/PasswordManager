import fs from 'fs';

const path = './users.json';

// Tip za jednog korisnika
export interface EncryptedVaultEntry {
  iv: string;
  data: string;
}

export interface UserData {
  email: string;
  passwordHash: string;
  encryptionSalt: string;
  vault: EncryptedVaultEntry[];
  vaultHmac: string;
}

export function loadUsers(): UserData[] {
  if (!fs.existsSync(path)) return [];
  return JSON.parse(fs.readFileSync(path, 'utf-8')) as UserData[];
}

export function saveUsers(users: UserData[]): void {
  fs.writeFileSync(path, JSON.stringify(users, null, 2));
}
