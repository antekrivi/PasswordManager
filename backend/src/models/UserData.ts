import { EncryptedVaultEntry } from "./EncryptedVaultEntry";

export interface UserData {
  passwordHash: string;
  encryptionSalt: string;
  vault: EncryptedVaultEntry[];
  vaultHmac: string;
}