import BaseModel from '@/biz/model-base/common/base-model';
import { format } from '@/biz/model-base/decorator/attribute';

export default class MAdminRoleConfig extends BaseModel {
  id = 0;

  type = 1;

  name = '';

  adminCount = 0;

  menuIds: number[] = [];

  creator: {
    id: number;
    name: string;
  } = {
    id: 0,
    name: '',
  };

  @format('date', 'save')
  createdAt = '';

  @format('date', 'save')
  updatedAt = '';
}
