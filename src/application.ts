import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import path from 'path';
import {TokenServiceBindings} from './keys';
import {setupAuthentication} from './security';
import {MySequence} from './sequence';
import {RoleAuthorizationProvider} from './services/authorization.provider';
import {JWTService} from './services/jwt-services'; // Ensure this import is correct
export {ApplicationConfig};
dotenv.config();

export class AuthenticationApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.bind('authorizationProviders.role-provider').toProvider(RoleAuthorizationProvider);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.TOKEN_SECRET || 'your_default_secret_here');
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(process.env.TOKEN_EXPIRES_IN || '1d');

    // Bind JWTService
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    setupAuthentication(this);
  }
}
