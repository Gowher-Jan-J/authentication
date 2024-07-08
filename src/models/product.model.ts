import {Entity, model, property} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';

@model()
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
    default: uuidv4,
  })
  pid: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  image: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;
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


  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
