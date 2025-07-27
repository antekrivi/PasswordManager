import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "../services/auth.service";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
import { sendHintEmail } from "../utils/mailer";

export class AuthController {
  constructor(private authService: AuthService) {}

  registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, masterPassword, note } = req.body;
    await this.authService.registerUser(email, masterPassword, note);
    res.status(201).json({ message: "User registered successfully" });
  });

  loginUser = asyncHandler(async (req: Request, res: Response) => {
    console.log("Login request received:");
    const { email, masterPassword } = req.body;
    
    try{
      const user = await this.authService.loginUser(email, masterPassword);
      const {accessToken, refreshToken} = await this.authService.generateTokens(user.id.toString(), user.email);
      
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.status(200).json({
        message: "User logged in successfully",
        user: {email: user.email}
      });
    }
    catch (error: any) {
      const errorMessage = error.message || "Neuspješna prijava";
      let statusCode = 401;

      if (errorMessage.includes("zaključan")) {
        statusCode = 423;
      } else if (errorMessage.includes("Neispravni korisnik")) {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: errorMessage });
    }
  
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) res.sendStatus(401);

    try {
      const payload: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
      const user = await UserModel.findById(payload.id);
      if (!user)
        res.sendStatus(403);
      else{
        const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_ACCESS_SECRET!,
          { expiresIn: '15m' });

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000
        });

        res.sendStatus(200);
      }
    } catch {
      res.sendStatus(403);
    }
  });

  logoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: "User logged out successfully" });
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    res.json({ user });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user || !user.passwordHint) {
        res.status(200).json({ message: 'Account doesnt exist' });
        return;
      }
      await sendHintEmail(user.email, user.passwordHint);

      res.status(200).json({ message: 'If an account exists, an email has been sent.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Server error' });
    }});

}
