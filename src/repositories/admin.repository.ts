import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AdminDataSource} from '../datasources';
import {Admin, AdminRelations} from '../models';

export class AdminRepository extends DefaultCrudRepository<
  Admin,
  typeof Admin.prototype.id,
  AdminRelations
> {
  login: any;
  constructor(
    @inject('datasources.admin') dataSource: AdminDataSource,
  ) {
    super(Admin, dataSource);
  }
}
