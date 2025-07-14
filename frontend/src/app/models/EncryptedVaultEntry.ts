export interface EncryptedVaultEntry {
    ciphertext: string;
    iv: string;
    tag: string;
    salt: string;
}
