import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {securityId, UserProfile} from '@loopback/security';
import {sign, verify} from 'jsonwebtoken';
import {promisify} from 'util';
import {TokenServiceBindings} from '../keys';

const signAsync = promisify(sign);
const verifyAsync = promisify(verify);
const expiresIn = 24 * 60 * 60;


export class JWTService implements TokenService {
  private jwtSecret: any // Non-null assertion operator

  private jwtExpiresIn: number;

  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecretInjected: any,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresInInjected: string,
  ) {
    this.jwtSecret = this.jwtSecretInjected || 'your_default_secret_here'; // Assign a default value if jwtSecretInjected is falsy
    this.jwtExpiresIn = expiresIn;
  }

  async generateToken(userProfile: UserProfile): Promise<any> {
    const {id, role} = userProfile;

    const token = await signAsync({id, role}, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn || '1d',
      algorithm: 'HS256' as any,
    })

    return token;
  }

  //   async verifyToken(token: string): Promise<UserProfile> {
  //     try {
  //       const decoded = await verifyAsync(token) as unknown as {id: string; role: string};
  //       console.log("🚀 ~ JWTService ~ verifyToken ~ decoded:", decoded)

  //       // Ensure the decoded object has the required properties
  //       const userProfile: UserProfile = {

  //         [securityId]: decoded.id, // Assign id to [securityId]
  //         id: decoded.id, // Assign id directly (optional, based on your UserProfile definition)
  //         role: decoded.role, // Assign roles
  //       };
  //       console.log("🚀 ~ JWTService ~ verifyToken ~ userProfile:", userProfile)
  //       return userProfile;
  //     } catch (error) {
  //       console.log(error);

  //       if (error instanceof JsonWebTokenError) {
  //         console.error('JWT error:', error.message);
  //         throw new Error('jwt_invalid');
  //       } else if (error instanceof TokenExpiredError) {
  //         console.error('Token expired:', error.message);
  //         throw new Error('jwt_expired');
  //       } else {
  //         console.error('Unexpected error:', error.message);
  //         throw new Error('unexpected_error');
  //       }
  //     }


  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decoded: any = await verifyAsync(token);
      console.log("🚀 ~ verifyToken ~ decoded:", decoded)
      const userProfile: UserProfile = {
        id: decoded.id,
        role: decoded.role,
        [securityId]: ''
      };
      console.log("🚀 ~ verifyToken ~ userProfile:", userProfile)
      return userProfile;
    } catch (error) {
      console.error('Error verifying token:', error.message);
      throw new Error('Unauthorized');
    }
  }
}
