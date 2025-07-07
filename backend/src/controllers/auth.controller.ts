import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserData } from "../models/User";
import { AuthService } from "../services/auth.service";

// auth.controller.ts
export class AuthController {
  constructor(private authService: AuthService) {}

  registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, masterPassword, note } = req.body;
    await this.authService.registerUser(email, masterPassword, note);
    res.status(201).json({ message: "User registered successfully" });
  });
  

  loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, masterPassword } = req.body;
    const user = await this.authService.loginUser(email, masterPassword);
    res.status(200).json(user); // ili token
  });
}
