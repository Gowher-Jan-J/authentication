import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {UserProfile, securityId} from '@loopback/security';
import {JsonWebTokenError, TokenExpiredError, sign, verify} from 'jsonwebtoken';
import {promisify} from 'util';
import {TokenServiceBindings} from '../keys';

const signAsync = promisify(sign);
const verifyAsync = promisify(verify);



export class JWTService implements TokenService {
  private jwtSecret: any // Non-null assertion operator

  private jwtExpiresIn: string;

  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecretInjected: any,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresInInjected: string,
  ) {
    this.jwtSecret = this.jwtSecretInjected || 'your_default_secret_here'; // Assign a default value if jwtSecretInjected is falsy
    this.jwtExpiresIn = this.jwtExpiresInInjected || '1d';
  }

  async generateToken(userProfile: UserProfile): Promise<any> {
    const {id, roles} = userProfile;

    const token = await signAsync({id, roles}, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn || '1d',
      algorithm: 'HS256' as any,
    })

    return token;
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
