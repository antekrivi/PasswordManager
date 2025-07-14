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
            throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await argon2.verify(user.passwordHash, email + masterPassword);
        if (!isPasswordCorrect) {
            throw new Error('Invalid credentials');
        }

        //const token = await this.generateTokens(user._id.toString(), user.email);

        return {
            //token,
            
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
