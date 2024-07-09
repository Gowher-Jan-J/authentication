// middleware/role-authorize.middleware.ts

import {Provider, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {NextFunction, Request, Response} from 'express';

import {AuthenticationBindings, AuthenticationMetadata} from '@loopback/authentication';
import {ValueOrPromise} from '@loopback/core';

export class RoleAuthorizeMiddlewareProvider implements Provider<(req: Request, res: Response, next: NextFunction) => ValueOrPromise<void>> {
  constructor(
    @inject(AuthenticationBindings.METADATA) private metadata: AuthenticationMetadata,
  ) { }

  value(): (req: Request, res: Response, next: NextFunction) => ValueOrPromise<void> {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole: string | undefined = (req as any).Admin?.role;
      const requiredRole: string = this.metadata.options?.requiredRole;

      if (!userRole || userRole !== requiredRole) {
        throw new HttpErrors.Forbidden('Unauthorized');
      }

      next();
    };
  }
}
