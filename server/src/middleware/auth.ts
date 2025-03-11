import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Auth middleware hit');
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('No token provided');
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    console.log('Token verified for user:', decoded.username);
    req.user = { username: decoded.username };
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};