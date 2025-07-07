// src/models/VaultEntry.model.ts
/*import { Schema, Document } from 'mongoose';

export interface VaultEntry extends Document {
  title: string;
  email: string;
  password: string;
  note?: string;
}

const VaultEntrySchema = new Schema<VaultEntry>({
  title: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  note: { type: String, required: false },
});

export default VaultEntrySchema;*/

// src/models/VaultEntry.model.ts
import { Schema, model, InferSchemaType } from 'mongoose';

const VaultEntrySchema = new Schema({
  title: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  note: { type: String, required: false },
});

export type VaultEntry = InferSchemaType<typeof VaultEntrySchema>;
export const VaultEntryModel = model<VaultEntry>('VaultEntry', VaultEntrySchema);
