// src/services/user.service.ts

import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import * as bcrypt from 'bcrypt';
import {Admin} from '../models';
import {AdminRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(
    @repository(AdminRepository)
    public admincRepository: AdminRepository,
  ) { }

  async verifyCredentials(email: string, password: string): Promise<Admin> {
    const user = await this.admincRepository.findOne({where: {email}});
    // console.log("🚀 ~ UserService ~ verifyCredentials ~ user:", user)
    if (user == null && user == undefined) {
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    // console.log("p", password, user.password);

    // console.log("🚀 ~ UserService ~ verifyCredentials ~ passwordMatched:", passwordMatched)
    if (passwordMatched == null) {
      throw new HttpErrors.Unauthorized('Invalid email or password.');
    }

    return user;
  }

  convertToUserProfile(user: Admin): UserProfile {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      [securityId]: user.id
    };
  }
}
