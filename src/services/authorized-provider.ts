import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider, inject} from '@loopback/core';
import {UserProfile} from '@loopback/security';

export class RoleAuthorizerProvider implements Provider<Authorizer> {
  constructor(
    @inject('authentication.currentUser') private currentUser: UserProfile,
  ) { }

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    const userRoles = this.currentUser.role;
    const requiredRoles = metadata.allowedRoles ?? [];

    const hasRole = requiredRoles.includes(userRoles);
    return hasRole
      ? AuthorizationDecision.ALLOW
      : AuthorizationDecision.DENY;
  }
}
