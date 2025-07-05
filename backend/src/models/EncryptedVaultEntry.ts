export interface EncryptedVaultEntry {
  salt: string;       // base64
  iv: string;         // base64
  ciphertext: string; // base64
  tag: string;        // base64
}