import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';
import { SignUpSchema, SignInSchema } from '../schemas/auth.schema.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = SignUpSchema.parse(req.body);
      const data = await this.authService.signUp(email, password);
      res.status(201).json({
        message: 'User created successfully',
        user: data.user,
        session: data.session,
      });
    } catch (error) {
      next(error);
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = SignInSchema.parse(req.body);
      const data = await this.authService.signIn(email, password);
      res.status(200).json({
        user: data.user,
        session: data.session,
      });
    } catch (error) {
      next(error);
    }
  };

  public signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length)
        : undefined;

      if (!token) {
        return res.status(400).json({ error: 'Missing access token' });
      }

      await this.authService.signOut(token);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
