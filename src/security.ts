import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, SECURITY_SCHEME_SPEC} from '@loopback/authentication-jwt';
import {Application} from '@loopback/core';

export async function setupAuthentication(app: Application) {
  // Mount authentication system
  app.component(AuthenticationComponent);
  app.component(JWTAuthenticationComponent);

  // Set up the security scheme
  const config = {
    openapi: '3.0.0',
    components: {securitySchemes: SECURITY_SCHEME_SPEC},
  };
  app.bind('openApiSpec').to(config);
}
