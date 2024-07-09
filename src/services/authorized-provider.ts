import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import {inject, Provider, ValueOrPromise} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import {JWTService} from './jwt-services';

export class MyAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @inject('services.JWTService')
    public jwtService: JWTService,
  ) { }

  value(): Authorizer {
    return this.authorize.bind(this) as Authorizer;
  }

  authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): ValueOrPromise<AuthorizationDecision> {
    const user: UserProfile = authorizationCtx.principals[0];
    console.log("🚀 ~ MyAuthorizationProvider ~ user:", user)

    if (!user) {
      return AuthorizationDecision.DENY;
    }

    const allowedRoles = metadata.allowedRoles;
    console.log("🚀 ~ MyAuthorizationProvider ~ allowedRoles:", allowedRoles)
    if (!allowedRoles || allowedRoles.length === 0) {
      return AuthorizationDecision.ALLOW;
    }

    if (allowedRoles.includes(user.role)) {
      return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
  }
}
