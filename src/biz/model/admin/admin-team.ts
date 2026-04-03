import { getOptions } from '@/biz/const/common';
import BaseModel from '@/biz/model-base/common/base-model';
import { format } from '@/biz/model-base/decorator/attribute';

export default class MAdminTeam extends BaseModel {
  id = 0;

  @format('option', getOptions(['代理商', '公司', '部门']))
  type = 2;

  name = '';

  path = '';

  parentId = 0;

  remark = '';

  vipPrice = 0.015;

  @format('date', 'save')
  createdAt = '';

  @format('date', 'save')
  updatedAt = '';

  children?: this[] = [];
}
