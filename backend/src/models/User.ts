import { Schema, model, InferSchemaType } from 'mongoose';
import EncryptedVaultEntrySchema from './EncryptedVaultEntry';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  passwordHint: { type: String, default: '' },
  encryptionSalt: { type: String, required: true },
  vault: { type: [EncryptedVaultEntrySchema], default: [] },
  vaultHmac: { type: String, required: true },
  failedLoginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  lockUntil: { type: Date, default: null }
}, { timestamps: true });

export type UserData = InferSchemaType<typeof UserSchema>;
const UserModel = model<UserData>('User', UserSchema);

export default UserModel;
