import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const loginRateLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 min
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      message: 'Previše pokušaja prijave. Pokušajte ponovno za 15 minuta.',
    });
  },
});
