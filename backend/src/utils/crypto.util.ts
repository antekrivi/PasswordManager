import asyncHandler from "express-async-handler";
import argon2 from 'argon2';
import { VaultEntry } from "../models/VaultEntry";
import EncryptedVaultEntrySchema, { EncryptedVaultEntry } from "../models/EncryptedVaultEntry";
import crypto from 'crypto';

export const deriveKey = async(masterPassword: string, baseSalt64: string): Promise<Buffer> =>{

    const salt = Buffer.from(baseSalt64, 'base64');
    return await argon2.hash(masterPassword, {
        type: argon2.argon2id,
        salt,
        hashLength: 32,
        raw: true
    });
}

export const encryptVaultEntry = async(masterPassword: string, entry : VaultEntry): 
    Promise<EncryptedVaultEntry> => {

    const entrySalt = crypto.randomBytes(16);       //salt specifican za entry
    const key = await deriveKey(masterPassword, entrySalt.toString('base64'));
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const entryJson = JSON.stringify(entry);

    const encrypted = Buffer.concat([cipher.update(entryJson, 'utf-8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    const entryData : EncryptedVaultEntry = {
        salt: entrySalt.toString('base64'),
        iv: iv.toString('base64'),
        ciphertext: encrypted.toString('base64'),
        tag: tag.toString('base64')
    };
    return entryData;
}

export const decryptVaultEntry = async(masterPasswrod: string, entry: EncryptedVaultEntry)
    : Promise<VaultEntry> => {
    
    const key = await deriveKey(masterPasswrod, entry.salt);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(entry.iv, 'base64'));
    decipher.setAuthTag(Buffer.from(entry.tag, 'base64'));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(entry.ciphertext, 'base64')),
        decipher.final()
    ]);

    return JSON.parse(decrypted.toString('utf-8')) as VaultEntry;
}

export const calculateVaultHmac = (vault: EncryptedVaultEntry[], hmacKey: Buffer): string => {
    const hmac = crypto.createHmac('sha256', hmacKey);
    const sanitizedVault = vault.map(entry => ({
        salt: entry.salt,
        iv: entry.iv,
        ciphertext: entry.ciphertext,
        tag: entry.tag
    }));
    hmac.update(JSON.stringify(sanitizedVault));
    return hmac.digest('hex');
}

export const deriveHmacKey = async(masterPassword: string, encryptionSalt: string): Promise<Buffer> => {
    return await deriveKey(masterPassword, encryptionSalt);
}
