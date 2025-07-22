import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  
  if(!req.cookies){
    console.error("No cookies found in the request");
    res.sendStatus(401);
    return;
  }
  
  const token = req.cookies.accessToken;

  if (!token){
    res.sendStatus(401);
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    (req as Request).user = payload;
    next();
  } catch (err) {
    res.sendStatus(403); // Token expired or invalid
    return;
  }
}
