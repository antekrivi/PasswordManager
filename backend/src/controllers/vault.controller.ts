import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "../services/auth.service";
import { VaultService } from "../services/vault.service";

// auth.controller.ts
export class VaultController {

  constructor(private vaultService: VaultService) {}

  unlockVault = asyncHandler(async (req: Request, res: Response) => {

    const { email, masterPassword} = req.body;

    try {
      const decryptedEntries = await this.vaultService.unlockVault(email, masterPassword);
      res.status(200).json(decryptedEntries); // ← Samo ovo, bez message wrapper-a
    } catch (error) {
      console.error("Error unlocking vault:", error);
      res.status(400).json({ message: error });
    }
  });
  


}
