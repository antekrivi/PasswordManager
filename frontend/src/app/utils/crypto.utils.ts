/*import crypto from 'crypto';
import argon2 from 'argon2';
import { EncryptedVaultEntry } from '../models/EncryptedVaultEntry';
import { VaultEntry } from '../models/VaultEntry';


export async function deriveKey(masterPassword: string, saltBase64: string): Promise<Buffer> {
  const salt = Buffer.from(saltBase64, 'base64');
  return await argon2.hash(masterPassword, {
    type: argon2.argon2id,
    salt,
    hashLength: 32,
    raw: true,
  });
}

export async function deriveHmacKey(masterPassword: string, encryptionSalt: string): Promise<Buffer> {
  return await deriveKey(masterPassword, encryptionSalt);
}

export function calculateVaultHmac(vault: EncryptedVaultEntry[], hmacKey: Buffer): string {
  const hmac = crypto.createHmac('sha256', hmacKey);
  hmac.update(JSON.stringify(vault));
  return hmac.digest('hex');
}

export async function decryptVaultEntry(masterPassword: string, entry: EncryptedVaultEntry): Promise<VaultEntry> {
  const key = await deriveKey(masterPassword, entry.salt);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(entry.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(entry.tag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(entry.ciphertext, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('utf8')) as VaultEntry;
}
*/