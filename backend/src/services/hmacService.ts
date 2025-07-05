import crypto from 'crypto';

/**
 * Računa HMAC (SHA-256) vrijednost nad JSON reprezentacijom vaulta pomoću zadanog ključa.
 * @param vault Vault sadržaj (niz zapisa, može sadržavati bilo što serijalizabilno)
 * @param hmacKey Buffer s tajnim HMAC ključem
 * @returns HMAC heksadecimalni string
 */
export function calculateVaultHmac(vault: any[], hmacKey: Buffer): string {
  const hmac = crypto.createHmac('sha256', hmacKey);
  hmac.update(JSON.stringify(vault));
  return hmac.digest('hex');
}
