import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import {Provider, ValueOrPromise} from '@loopback/core';
import {UserProfile} from '@loopback/security';

export class RoleAuthorizationProvider implements Provider<Authorizer> {
  constructor() { }

  value(): Authorizer {
    return async (authorizationCtx: AuthorizationContext, metadata: AuthorizationMetadata) => {
      return this.authorize(authorizationCtx, metadata);
    }
  }

  authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): ValueOrPromise<AuthorizationDecision> {
    const user: UserProfile = authorizationCtx.principals[0];
    const allowedRoles = metadata.allowedRoles;

    if (!allowedRoles) {
      return AuthorizationDecision.ALLOW;
    }

    if (allowedRoles.includes(user.role)) {
      return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
  }
}
