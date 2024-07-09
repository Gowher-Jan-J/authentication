import {Entity, model, property} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';

enum Role {
  USER,
  ADMIN,
}

@model()
export class Admin extends Entity {
  static role(role: any) {
    throw new Error('Method not implemented.');
  }
  @property({
    type: 'string',
    id: true,
    default: uuidv4,
  })
  id: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber: string;

  @property({
    type: 'number',
    required: true,
  })
  role: Role;

  @property({
    type: 'date',
    required: true,
  })
  created_at: string;

  @property({
    type: 'date',
    required: true,
  })
  updated_at: string;



  constructor(data?: Partial<Admin>) {
    super(data);
  }
}

export interface AdminRelations {
  // describe navigational properties here
}

export type AdminWithRelations = Admin & AdminRelations;
