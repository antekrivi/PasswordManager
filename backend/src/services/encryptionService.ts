import crypto from 'crypto';
import { deriveKey } from './keyDerivationService';

// Tip koji predstavlja enkriptirani unos vaulta
export interface EncryptedVaultEntry {
  salt: string;
  iv: string;
  ciphertext: string;
  tag: string;
}

// Tip koji predstavlja dekriptirani unos vaulta
export interface DecryptedVaultEntry {
  title: string;
  email: string;
  password: string;
  note: string;
}

// Enkripcija jednog unosa
export async function encryptVaultEntry(
  masterPassword: string,
  entry: DecryptedVaultEntry
): Promise<EncryptedVaultEntry> {
  const entrySalt = crypto.randomBytes(16);
  const key = await deriveKey(masterPassword, entrySalt.toString('base64'));
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const json = JSON.stringify(entry);

  const encrypted = Buffer.concat([
    cipher.update(json, 'utf8'),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return {
    salt: entrySalt.toString('base64'),
    iv: iv.toString('base64'),
    ciphertext: encrypted.toString('base64'),
    tag: tag.toString('base64')
  };
}

// Dekripcija jednog unosa
export async function decryptVaultEntry(
  masterPassword: string,
  entry: EncryptedVaultEntry
): Promise<DecryptedVaultEntry> {
  const key = await deriveKey(masterPassword, entry.salt);
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(entry.iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(entry.tag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(entry.ciphertext, 'base64')),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString('utf8'));
}
