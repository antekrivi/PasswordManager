// src/models/User.model.ts
/*import { Schema, model, Document } from 'mongoose';
import EncryptedVaultEntrySchema, { EncryptedVaultEntry } from './EncryptedVaultEntry';

export interface UserData extends Document {
  email: string;
  passwordHash: string;
  passwordHint: string; // Optional field for password hint
  encryptionSalt: string;
  vault: EncryptedVaultEntry[];
  vaultHmac: string;
}

const UserSchema = new Schema<UserData>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  passwordHint: { type: String, default: '' }, // Optional field for password hint
  encryptionSalt: { type: String, required: true },
  vault: { type: [EncryptedVaultEntrySchema], default: [] },
  vaultHmac: { type: String, required: true },
});

const UserModel = model<UserData>('User', UserSchema);

export default UserModel;
*/
// src/models/User.model.ts
import { Schema, model, InferSchemaType } from 'mongoose';
import EncryptedVaultEntrySchema from './EncryptedVaultEntry';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  passwordHint: { type: String, default: '' },
  encryptionSalt: { type: String, required: true },
  vault: { type: [EncryptedVaultEntrySchema], default: [] },
  vaultHmac: { type: String, required: true },
}, { timestamps: true });

export type UserData = InferSchemaType<typeof UserSchema>;
const UserModel = model<UserData>('User', UserSchema);

export default UserModel;
