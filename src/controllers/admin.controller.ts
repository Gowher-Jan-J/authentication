import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {TokenServiceBindings} from "../keys";
import {JWTMiddlewareProvider} from '../middleware/jwt-middleware';
import {RoleAuthorizeMiddlewareProvider} from '../middleware/role-authorize.middleware';
import {Admin} from '../models';
import {AdminRepository} from '../repositories';
import {JWTService} from "../services/jwt-services";
import {UserService} from "../services/user-services";



export class AdminController {
  authenticateUser: any;
  response: any;
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private jwtService: JWTService,
    @inject('services.UserService')
    public userService: UserService,
    @inject('middleware.jwt') private jwt: JWTMiddlewareProvider,
    @inject('middleware.role.authorize') private authorize: RoleAuthorizeMiddlewareProvider,

  ) { }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  @response(200, {
    description: 'Admin model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin)}},
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
              // role: {type: 'string'}
            },
            required: ['email', 'password'],
          },
        },
      },
    })
    User: Admin
  ): Promise<{token: string}> {
    // console.log("🚀 ~ AdminController ~ User:", User)

    const user = await this.userService.verifyCredentials(User.email, User.password);
    // console.log("🚀 ~ AdminController ~ user:", user)
    const userProfile = this.userService.convertToUserProfile(user);
    // console.log("🚀 ~ AdminController ~ userProfile:", userProfile)
    const token = await this.jwtService.generateToken(userProfile);
    // console.log("🚀 ~ AdminController ~ token:", token)

    return {token};
  }

  @post('/admins')
  @response(200, {
    description: 'Admin model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {
            title: 'NewAdmin',
            exclude: ['id'],
          }),
        },
      },
    })
    admin: Omit<Admin, 'id'>,
  ): Promise<Admin> {
    // console.log(admin);
    return this.adminRepository.create(admin);


  }


  @authenticate('jwt')
  @authorize({
    allowedRoles: ["1"],
  })
  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Admin, {includeRelations: true}),
        },
      },
    },
  })
  @response(401, {
    description: 'Unauthorized',
  })
  async find(
    @param.filter(Admin) filter?: Filter<Admin>,
  ): Promise<Admin[]> {
    return this.adminRepository.find(filter);
  }


  @patch('/admins')
  @response(200, {
    description: 'Admin PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @response(401, {
    description: 'Unauthorized',
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Admin,
    @param.where(Admin) where?: Where<Admin>,
  ): Promise<Count> {
    try {
      return await this.adminRepository.updateAll(admin, where);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
  @authenticate('jwt')
  @get('/admins/{id}')
  @response(200, {
    description: 'Admin model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin, {includeRelations: true}),
      },
    },
  })
  @response(401, {
    description: 'Unauthorized',
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Admin, {exclude: 'where'})
    filter?: FilterExcludingWhere<Admin>,
  ): Promise<Admin> {
    try {
      return await this.adminRepository.findById(id, filter);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
  @authenticate('jwt')
  @patch('/admins/{id}')
  @response(204, {
    description: 'Admin PATCH success',
  })
  @response(401, {
    description: 'Unauthorized',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Admin,
  ): Promise<void> {
    try {
      await this.adminRepository.updateById(id, admin);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
  @authenticate('jwt')
  @put('/admins/{id}')
  @response(204, {
    description: 'Admin PUT success',
  })
  @response(401, {
    description: 'Unauthorized',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() admin: Admin,
  ): Promise<void> {
    try {
      await this.adminRepository.replaceById(id, admin);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
  @authenticate('jwt')
  @del('/admins/{id}')
  @response(204, {
    description: 'Admin DELETE success',
  })
  @response(401, {
    description: 'Unauthorized',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    try {
      await this.adminRepository.deleteById(id);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
}
