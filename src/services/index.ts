import {TokenService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {JsonWebTokenError, TokenExpiredError, verify} from 'jsonwebtoken';
import {promisify} from 'util';

const verifyAsync = promisify(verify);

export class JWTService implements TokenService {
  private jwtSecret: string;

  constructor(
    jwtSecret: string
  ) {
    this.jwtSecret = jwtSecret;
  }
  generateToken(userProfile: UserProfile): Promise<string> {
    throw new Error('Method not implemented.');
  }
  revokeToken?(token: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decoded = await verifyAsync(token) as unknown as {id: string; roles: string[]};

      // Ensure the decoded object has the required properties
      const userProfile: UserProfile = {
        [securityId]: decoded.id, // Assign id to [securityId]
        id: decoded.id, // Assign id directly (optional, based on your UserProfile definition)
        roles: decoded.roles, // Assign roles
      };

      return userProfile;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        console.error('JWT error:', error.message);
        throw new Error('jwt_invalid');
      } else if (error instanceof TokenExpiredError) {
        console.error('Token expired:', error.message);
        throw new Error('jwt_expired');
      } else {
        console.error('Unexpected error:', error.message);
        throw new Error('unexpected_error');
      }
    }
  }
}
