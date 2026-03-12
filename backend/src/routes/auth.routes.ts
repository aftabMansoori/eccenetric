import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { AuthService } from '../services/AuthService.js';

const router = Router();

// Dependency Injection
const authService = new AuthService();
const authController = new AuthController(authService);

// Endpoints
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

export default router;
