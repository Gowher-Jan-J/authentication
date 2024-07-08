import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
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
import {Admin} from '../models';
import {AdminRepository} from '../repositories';
import {JWTService} from "../services/jwt-services";

export class AdminController {
  authenticateUser: any;
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
    @inject('services.JWTService')
    private jwtService: JWTService,
  ) { }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token generated successfully',
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
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['email', 'password'],
          },
        },
      },
    })
    credentials: {email: string; password: string},
  ): Promise<{token: string}> {
    try {
      // Example: Replace with actual authentication logic
      const authenticatedUser = await this.authenticateUser(credentials);

      if (!authenticatedUser) {
        throw new Error('Invalid credentials');
      }

      const token = await this.jwtService.generateToken(authenticatedUser);

      return {token};
    } catch (error) {
      throw new Error('Authentication failed');
    }
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
    console.log(admin);
    return this.adminRepository.create(admin);


  }

  @authenticate('jwt')
  @get('/admins/count')
  @response(200, {
    description: 'Admin model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @response(401, {
    description: 'Unauthorized',
  })
  async count(@param.where(Admin) where?: Where<Admin>): Promise<Count> {
    try {
      return await this.adminRepository.count(where);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
  @authenticate('jwt')
  @get('/admins')
  @response(200, {
    description: 'Array of Admin model instances',
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
  async find(@param.filter(Admin) filter?: Filter<Admin>): Promise<Admin[]> {
    try {
      return await this.adminRepository.find(filter);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
  @authenticate('jwt')
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
