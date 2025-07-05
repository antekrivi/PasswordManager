import argon2 from 'argon2';
import crypto from 'crypto';

import { loadUsers, saveUsers } from '../services/userService';
import { prompt } from '../utils/prompt';
import { encryptVaultEntry, decryptVaultEntry } from '../services/encryptionService';
import { deriveHmacKey } from '../services/keyDerivationService';
import { calculateVaultHmac } from '../services/hmacService';

// Definicije tipova (prebaci ih u zasebni file ako želiš)
interface VaultEntry {
    title: string;
    email: string;
    password: string;
    note: string;
}

export interface EncryptedVaultEntry {
    salt: string;
    iv: string;
    ciphertext: string;
    tag: string;
}

interface UserData {
    email: string;
    passwordHash: string;
    encryptionSalt: string;
    vault: EncryptedVaultEntry[];
    vaultHmac: string;
}

export async function register(): Promise<void> {
    const users: UserData[] = loadUsers();

    const email = await prompt('📧 Unesi email: ');
    const masterPassword = await prompt('🔐 Unesi novi master password: ');

    const userExists = users.some(user => user.email === email);
    if (userExists) {
        console.log('❗ Korisnik već postoji.');
        return;
    }

    const passwordHash = await argon2.hash(email + masterPassword + process.env.PEPPER);
    const encryptionSalt = crypto.randomBytes(16).toString('base64');
    const vault: EncryptedVaultEntry[] = [];

    const hmacKey = await deriveHmacKey(masterPassword, encryptionSalt);
    const vaultHmac = calculateVaultHmac(vault, hmacKey);

    const userData: UserData = {
        email,
        passwordHash,
        encryptionSalt,
        vault,
        vaultHmac
    };

    users.push(userData);
    saveUsers(users);

    console.log('\n✅ Registracija uspješna! Podaci spremljeni u "user.json".');
}

export async function login(): Promise<void> {
    const users: UserData[] = loadUsers();
    if (users.length === 0) {
        console.log('❗ Nema registriranih korisnika. Molimo registrirajte se.');
        return;
    }

    const email = await prompt('📧 Unesi email: ');
    const masterPassword = await prompt('🔐 Unesi master password: ');

    const userData = users.find(user => user.email === email);
    if (!userData) {
        console.log('❗ Korisnik s tim podatcima ne postoji.');
        return;
    }

    const expectedHash = email + masterPassword + process.env.PEPPER;
    const isValid = await argon2.verify(userData.passwordHash, expectedHash);

    if (!isValid) {
        console.log('❌ Pogrešni login podatci!');
        return;
    }

    const hmacKey = await deriveHmacKey(masterPassword, userData.encryptionSalt);
    const expectedHmac = calculateVaultHmac(userData.vault, hmacKey);

    if (expectedHmac !== userData.vaultHmac) {
        console.log('🚨 Vault je možda izmijenjen ili kompromitiran! Prekid.');
        return;
    }

    console.log('\n✅ Autentifikacija i HMAC provjera uspješna!');

    const title = await prompt('\nUnesi naslov nove stavke: ');
    const emailEntry = await prompt('Unesi email nove stavke: ');
    const password = await prompt('Unesi lozinku nove stavke: ');
    const note = await prompt('Unesi napomenu nove stavke: ');
    const newEntry: VaultEntry = {
        title,
        email: emailEntry,
        password,
        note
    };

    const encryptedNewEntry = await encryptVaultEntry(masterPassword, newEntry);
    userData.vault.push(encryptedNewEntry);
    userData.vaultHmac = calculateVaultHmac(userData.vault, hmacKey);
    saveUsers(users);

    console.log('\n✅ Nova stavka dodana u vault i HMAC ažuriran!');
    console.log('\n🔓 Vault podaci:');

    for (const [i, entry] of userData.vault.entries()) {
        try {
            const decrypted = await decryptVaultEntry(masterPassword, entry);
            console.log(`\n#${i + 1}:`, decrypted);
        } catch {
            console.log(`\n#${i + 1}: ❌ Neuspješna dekripcija.`);
        }
    }
}
