import argon2 from 'argon2';
import { Buffer } from 'buffer';

/**
 * Derivira ključ iz master passworda i base64 salt stringa.
 * @param masterPassword Master lozinka
 * @param saltBase64 Salt u base64 obliku
 * @returns Derivirani ključ kao Buffer
 */
export async function deriveKey(masterPassword: string, saltBase64: string): Promise<Buffer> {
  const salt = Buffer.from(saltBase64, 'base64');
  return await argon2.hash(masterPassword, {
    type: argon2.argon2id,
    salt,
    hashLength: 32,
    raw: true, // da vrati Buffer umjesto hex stringa
  });
}

/**
 * Derivira HMAC ključ (identično deriveKey, ali logički odvojena svrha).
 * @param masterPassword Master lozinka
 * @param encryptionSalt Salt u base64 obliku
 * @returns Derivirani HMAC ključ kao Buffer
 */
export async function deriveHmacKey(masterPassword: string, encryptionSalt: string): Promise<Buffer> {
  return await deriveKey(masterPassword, encryptionSalt);
}
