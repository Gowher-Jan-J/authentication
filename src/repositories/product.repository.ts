import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ProductDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.pid,
  ProductRelations
> {
  constructor(
    @inject('datasources.product') dataSource: ProductDataSource,
  ) {
    super(Product, dataSource);
  }
}
