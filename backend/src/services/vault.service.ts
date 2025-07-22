import argon2 from 'argon2';
import crypto from "crypto";
import { EncryptedVaultEntry } from "../models/EncryptedVaultEntry";
import UserModel from "../models/User";
import { VaultEntry } from "../models/VaultEntry";
import { calculateVaultHmac, decryptVaultEntry, deriveHmacKey, encryptVaultEntry } from "../utils/crypto.util";


export class VaultService {

    constructor() {}

    async unlockVault(email: string, masterPassword: string): Promise<VaultEntry[]> {
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("User not found while unlocking vault");
        }
        
        const hmacKey = await deriveHmacKey(masterPassword, user.encryptionSalt);
        const vaultHmac = calculateVaultHmac(user.vault, hmacKey);

        if (vaultHmac !== user.vaultHmac) {
            throw new Error("Invalid master password or vault integrity compromised");
        }
        const decryptedEntries: VaultEntry[] = [];

        for (const encryptedEntry of user.vault) {
            try {
                const decryptedEntry = await decryptVaultEntry(masterPassword, encryptedEntry);
                decryptedEntries.push(decryptedEntry);
            } catch (error) {
                throw new Error(`Failed to decrypt vault entry: ${error}`);
            }
        }
        return decryptedEntries;
    }

    async addVaultEntry(email: string, masterPassword: string, entry: VaultEntry) {
        // Provjera korisnika
        console.log("Adding vault entry for user:", email);
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("User not found while adding vault entry");
        }
        const isValid = await argon2.verify(user.passwordHash, email + masterPassword);
        if (!isValid) {
            throw new Error('Pogrešan master password.');
        }
        //Dohvacanje starih entrija
        const decryptedEntries: VaultEntry[] = await this.unlockVault(email, masterPassword);
        decryptedEntries.push(entry);

        const vault: EncryptedVaultEntry[] = [];
        for (const decryptedEntry of decryptedEntries) {
            const encryptedEntry = await encryptVaultEntry(masterPassword, decryptedEntry);
            vault.push(encryptedEntry);
        }
        //dodavanje novog entrija
        
        const hmacKEy = await deriveHmacKey(masterPassword, user.encryptionSalt);
        const expectedVaultHmac = calculateVaultHmac(user.vault, hmacKEy);
        if (expectedVaultHmac !== user.vaultHmac) {
            throw new Error("Vault integrity compromised");
        }

        const newVaultHmac = calculateVaultHmac(vault, hmacKEy);

        user.set('vault', vault);
        user.vaultHmac = newVaultHmac;
        await user.save();

    }

    editVaultEntry = async (email: string, masterPassword: string, oldEntry: VaultEntry, newEntry: VaultEntry) => {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("User not found while editing vault entry");
        }
        const isValid = await argon2.verify(user.passwordHash, email + masterPassword);
        if (!isValid) {
            throw new Error('Pogrešan master password.');
        }

        const decryptedEntries: VaultEntry[] = await this.unlockVault(email, masterPassword);
        if (!decryptedEntries) {
            throw new Error("No entries found in vault");
        }
        const entryIndex = decryptedEntries.findIndex(entry => entry.title === oldEntry.title);

        if (entryIndex === -1) {
            throw new Error("Entry not found in vault");
        }
        decryptedEntries[entryIndex] = newEntry;
        const vault: EncryptedVaultEntry[] = [];
        for (const decryptedEntry of decryptedEntries) {
            const encryptedEntry = await encryptVaultEntry(masterPassword, decryptedEntry);
            vault.push(encryptedEntry);
        }

        const hmacKey = await deriveHmacKey(masterPassword, user.encryptionSalt);
        const expectedVaultHmac = calculateVaultHmac(user.vault, hmacKey);
        if (expectedVaultHmac !== user.vaultHmac) {
            throw new Error("Vault integrity compromised");
        }
        const newVaultHmac = calculateVaultHmac(vault, hmacKey);
        user.set('vault', vault);
        user.vaultHmac = newVaultHmac;
        await user.save();
    }

    deleteVaultEntry = async (email: string, masterPassword: string, entry: VaultEntry) => {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("User not found while deleting vault entry");
        }
        const isValid = await argon2.verify(user.passwordHash, email + masterPassword);
        if (!isValid) {
            throw new Error('Pogrešan master password.');
        }
        const decryptedEntries: VaultEntry[] = await this.unlockVault(email, masterPassword);
        if (!decryptedEntries) {
            throw new Error("No entries found in vault");
        }
        const entryIndex = decryptedEntries.findIndex(e => e.title === entry.title);
        decryptedEntries.splice(entryIndex, 1);
        const vault: EncryptedVaultEntry[] = [];
        for (const decryptedEntry of decryptedEntries) {
            const encryptedEntry = await encryptVaultEntry(masterPassword, decryptedEntry);
            vault.push(encryptedEntry);
        }
        const hmacKey = await deriveHmacKey(masterPassword, user.encryptionSalt);
        const expectedVaultHmac = calculateVaultHmac(user.vault, hmacKey);
        if (expectedVaultHmac !== user.vaultHmac) {
            throw new Error("Vault integrity compromised");
        }
        const newVaultHmac = calculateVaultHmac(vault, hmacKey);
        user.set('vault', vault);
        user.vaultHmac = newVaultHmac;
        await user.save();

    };
}