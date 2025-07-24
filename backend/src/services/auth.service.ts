import crypto from 'crypto';
import argon2 from 'argon2';
import UserModel from '../models/User';
import { calculateVaultHmac, deriveHmacKey } from '../utils/crypto.util';
import { EncryptedVaultEntry } from '../models/EncryptedVaultEntry';
import jwt from 'jsonwebtoken';

export class AuthService {

    constructor() {}

    async registerUser(email: string, masterPassword: string, hint: string) {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await argon2.hash(email + masterPassword);
        const encryptionSalt = crypto.randomBytes(16).toString('base64');

        const vault: EncryptedVaultEntry[] = [];

        const hmacKey = await deriveHmacKey(masterPassword, encryptionSalt);
        const vaultHmac = calculateVaultHmac(vault, hmacKey);

        const user = new UserModel({
            email,
            passwordHash,
            passwordHint: hint,
            encryptionSalt,
            vault,
            vaultHmac,
        });

        console.log("User created:", user);
        await user.save();
        return user;
    }

    async loginUser(email: string, masterPassword: string) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('Neispravni korisnik');
        }
        if (user.isLocked && user.lockUntil) {
            if (user.lockUntil > new Date()) {
                throw new Error('Račun je zaključan. Pokušajte ponovno kasnije.');
            }
            else {
                user.isLocked = false;
                user.failedLoginAttempts = 0;
                user.lockUntil =  new Date(Date.now() - 1);
            }
        }
        const isPasswordCorrect = await argon2.verify(user.passwordHash, email + masterPassword);
        if (!isPasswordCorrect) {
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= 15) {
                user.isLocked = true;
                user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 min lock
            }
            await user.save();
            throw new Error('Neispravna lozinka');
        }
        user.failedLoginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = new Date(Date.now() - 1); 
        await user.save();
        return {         
            id: user._id,
            email: user.email,
            passwordHint: user.passwordHint,
            encryptionSalt: user.encryptionSalt,
            vault: user.vault,
            vaultHmac: user.vaultHmac,
        };
    }
    
    async generateTokens(userId: string, email: string) {
        const accessToken = jwt.sign(
            { id: userId, email },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: userId },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '7d' }
        );
        return { accessToken, refreshToken };
    }
}
