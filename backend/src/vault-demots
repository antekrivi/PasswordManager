import fs from 'fs';
import crypto from 'crypto';
import argon2 from 'argon2';
import readline from 'readline';
import { VaultEntry } from './models/VaultEntry';
import { EncryptedVaultEntry } from './models/EncryptedVaultEntry';
import { UserData } from './models/User';

const USERS_DIR = './src/users';

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(question, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function deriveKey(masterPassword: string, saltBase64: string): Promise<Buffer> {
  const salt = Buffer.from(saltBase64, 'base64');
  return await argon2.hash(masterPassword, {
    type: argon2.argon2id,
    salt,
    hashLength: 32,
    raw: true,
  });
}

async function deriveHmacKey(masterPassword: string, encryptionSalt: string): Promise<Buffer> {
  return await deriveKey(masterPassword, encryptionSalt);
}

async function encryptVaultEntry(masterPassword: string, entry: VaultEntry): Promise<EncryptedVaultEntry> {
  const entrySalt = crypto.randomBytes(16);
  const key = await deriveKey(masterPassword, entrySalt.toString('base64'));
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const json = JSON.stringify(entry);
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    salt: entrySalt.toString('base64'),
    iv: iv.toString('base64'),
    ciphertext: encrypted.toString('base64'),
    tag: tag.toString('base64'),
  };
}

async function decryptVaultEntry(masterPassword: string, entry: EncryptedVaultEntry): Promise<VaultEntry> {
  const key = await deriveKey(masterPassword, entry.salt);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(entry.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(entry.tag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(entry.ciphertext, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('utf8')) as VaultEntry;
}

function calculateVaultHmac(vault: EncryptedVaultEntry[], hmacKey: Buffer): string {
  const hmac = crypto.createHmac('sha256', hmacKey);
  hmac.update(JSON.stringify(vault));
  return hmac.digest('hex');
}

async function register(): Promise<void> {
  const email = await prompt('👤 Unesi mail ime: ');
  const userFile = `${USERS_DIR}/${email.substring(0, 4)}.json`;

  if (fs.existsSync(userFile)) {
    console.log('❗ Korisnik već postoji.');
    return;
  }

  const masterPassword = await prompt('🔐 Unesi novi master password: ');

  const passwordHash = await argon2.hash(email + masterPassword);
  const encryptionSalt = crypto.randomBytes(16).toString('base64');
  const vault: EncryptedVaultEntry[] = [];

  const hmacKey = await deriveHmacKey(masterPassword, encryptionSalt);
  const vaultHmac = calculateVaultHmac(vault, hmacKey);

  const userData: UserData = {
    passwordHash,
    encryptionSalt,
    vault,
    vaultHmac,
  };

  fs.mkdirSync(USERS_DIR, { recursive: true });
  fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
  console.log(`\n✅ Registracija uspješna!`);
}

async function login(): Promise<void> {
  const email = await prompt('👤 Unesi email: ');
  const userFile = `${USERS_DIR}/${email.substring(0, 4)}.json`;

  if (!fs.existsSync(userFile)) {
    console.log('❗ Korisnik ne postoji.');
    return;
  }

  const userData: UserData = JSON.parse(fs.readFileSync(userFile, 'utf-8'));

  const masterPassword = await prompt('🔐 Unesi master password: ');
  const isValid = await argon2.verify(userData.passwordHash, email + masterPassword);

  if (!isValid) {
    console.log('❌ Pogrešan master password!');
    return;
  }

  const hmacKey = await deriveHmacKey(masterPassword, userData.encryptionSalt);
  const expectedHmac = calculateVaultHmac(userData.vault, hmacKey);

  if (expectedHmac !== userData.vaultHmac) {
    console.log('🚨 Vault je možda izmijenjen! Prekid.');
    return;
  }

  console.log('\n✅ Uspješan login!');
  console.log('\n🔓 Vault zapisi:');

  for (const [i, entry] of userData.vault.entries()) {
    try {
      const decrypted = await decryptVaultEntry(masterPassword, entry);
      console.log(`\n#${i + 1}:`, decrypted);
    } catch {
      console.log(`\n#${i + 1}: ❌ Neuspješna dekripcija.`);
    }
  }

  const addMore = await prompt('\n➕ Želite li dodati novi zapis? [da/ne]: ');
  if (addMore.toLowerCase() === 'da') {
    const title = await prompt('Unesi naslov: ');
    const email = await prompt('Unesi email: ');
    const password = await prompt('Unesi lozinku: ');
    const note = await prompt('Unesi napomenu (ili pritisni Enter za prazno): ');

    const newEntry: VaultEntry = {
      title,
      email,
      password,
      note
    };

    const encryptedEntry = await encryptVaultEntry(masterPassword, newEntry);
    userData.vault.push(encryptedEntry);

    // ponovno izračunaj HMAC
    userData.vaultHmac = calculateVaultHmac(userData.vault, hmacKey);

    fs.writeFileSync(userFile, JSON.stringify(userData, null, 2));
    console.log('✅ Novi zapis spremljen.');
  }
}

async function main(): Promise<void> {
  const mode = await prompt('\nOdaberi opciju: [1] Registracija [2] Login\n> ');

  if (mode === '1') await register();
  else if (mode === '2') await login();
  else console.log('❗ Nepoznata opcija.');
}

main();
