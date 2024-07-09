import {AuthenticationBindings, AuthenticationMetadata} from '@loopback/authentication';
import {Provider, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

// Interface for token payload
interface TokenPayload {
  id: string;
  email: string;
  role: number;
}





export class JWTMiddlewareProvider implements Provider<((...args: any[]) => any)> {
  verify() {
    throw new Error('Method not implemented.');
  }
  verifyToken() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @inject(AuthenticationBindings.METADATA) private metadata: AuthenticationMetadata,
  ) { }



  value(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
        if (!token) {
          throw new HttpErrors.Unauthorized('Authorization token missing');
        }

        // Verify and decode token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;

        // Attach user profile to request object
        (req as any).user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };

        next();
      } catch (error) {
        console.log(error);

        throw new HttpErrors.Unauthorized('Invalid token');
      }
    };
  }
}
