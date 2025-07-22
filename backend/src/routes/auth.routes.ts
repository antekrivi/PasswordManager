import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { VaultService } from '../services/vault.service';
import { VaultController } from '../controllers/vault.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = express.Router();
const authService = new AuthService();
const authController = new AuthController(authService);

const vaultService = new VaultService();
const vaultController = new VaultController(vaultService);

// POST /auth/...
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

//GET /auth/vault
router.post('/vault', vaultController.unlockVault);
router.post('/vault/new', vaultController.addVaultEntry);
router.put('/vault/edit', authenticateJWT, vaultController.editVaultEntry);
router.delete('/vault/delete', authenticateJWT, vaultController.deleteVaultEntry);

router.get('/me', authenticateJWT, authController.getCurrentUser);

export default router;
