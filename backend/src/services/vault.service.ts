import UserModel from "../models/User";
import { VaultEntry } from "../models/VaultEntry";
import { calculateVaultHmac, decryptVaultEntry, deriveHmacKey } from "../utils/crypto.util";


export class VaultService {

    constructor() {}

    async unlockVault(email: string, masterPassword: string): Promise<VaultEntry[]> {
        
    
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("User not found while unlocking vault");
        }
        
        console.log("Vault before HMAC (stringified):", JSON.stringify(user.vault, null, 2));
        const hmacKey = await deriveHmacKey(masterPassword, user.encryptionSalt);
        const vaultHmac = calculateVaultHmac(user.vault, hmacKey);

        console.log("Vault HMAC:", vaultHmac);
        console.log("User Vault HMAC:", user.vaultHmac);
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
}