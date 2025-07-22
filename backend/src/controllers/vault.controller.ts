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
      res.status(200).json(decryptedEntries);
    } catch (error) {
      console.error("Error unlocking vault:", error);
      res.status(400).json({ message: error });
    }
  });
  
  addVaultEntry = asyncHandler(async (req: Request, res: Response)=> {
    const {email, masterPassword, entry} = req.body;
    console.log(req.body);
    try{
      this.vaultService.addVaultEntry(email, masterPassword, entry);
      res.status(200).json(entry);
    }
    catch(error){
      console.error("Greška pri dodavanju entrya u vault");
      res.status(400).json({message: error});
    }
  });

  editVaultEntry = asyncHandler(async (req: Request, res: Response) => {
    const email = req.user.email;
    const {masterPassword, oldEntry, newEntry } = req.body;
    try {
      await this.vaultService.editVaultEntry(email, masterPassword, oldEntry, newEntry);
      res.status(200).json({ message: "Entry updated successfully" });
    } catch (error) {
      console.error("Error editing vault entry:", error);
      res.status(400).json({ message: error });
    }
  });

  deleteVaultEntry = asyncHandler(async (req: Request, res: Response) => {
    const email = req.user.email;
    const { masterPassword, entry } = req.body;
    console.log("Deleting entry:", entry);
    if (!entry || !entry.title) {
      res.status(400).json({ message: "Invalid entry data" });
    }
    try {
      await this.vaultService.deleteVaultEntry(email, masterPassword, entry);
      res.status(200).json({ message: "Entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting vault entry:", error);
      res.status(400).json({ message: error });
    }
  });

}
