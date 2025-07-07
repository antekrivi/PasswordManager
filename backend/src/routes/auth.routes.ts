import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

const router = express.Router();
const authService = new AuthService();
const authController = new AuthController(authService);

// POST /api/auth/register
router.post('/register', authController.registerUser);

export default router;
