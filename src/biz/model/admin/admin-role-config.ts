import BaseModel from '@/biz/model-base/common/base-model';
import { format, itemModel } from '@/biz/model-base/decorator/attribute';
import MAdminInfo from './admin-info';

export default class MAdminRoleConfig extends BaseModel {
  id = 0;

  type = 1;

  name = '';

  adminCount = 0;

  menuIds: number[] = [];

  @itemModel(MAdminInfo)
  creator = new MAdminInfo();

  @format('date', 'save')
  createdAt = '';

  @format('date', 'save')
  updatedAt = '';
}
