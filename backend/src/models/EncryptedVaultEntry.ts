// src/models/EncryptedVaultEntry.model.ts
/*import { Schema, Document } from 'mongoose';

export interface EncryptedVaultEntry extends Document {
  salt: string;       // base64
  iv: string;         // base64
  ciphertext: string; // base64
  tag: string;        // base64
}

const EncryptedVaultEntrySchema = new Schema<EncryptedVaultEntry>({
  salt: { type: String, required: true },
  iv: { type: String, required: true },
  ciphertext: { type: String, required: true },
  tag: { type: String, required: true },
});

export default EncryptedVaultEntrySchema;
*/

import { Schema, InferSchemaType } from 'mongoose';

const EncryptedVaultEntrySchema = new Schema({
  salt: { type: String, required: true },
  iv: { type: String, required: true },
  ciphertext: { type: String, required: true },
  tag: { type: String, required: true },
});

export type EncryptedVaultEntry = InferSchemaType<typeof EncryptedVaultEntrySchema>;
export default EncryptedVaultEntrySchema;
