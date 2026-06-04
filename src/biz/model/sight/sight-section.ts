import BaseModel from '@/biz/model-base/common/base-model';
import { format } from '@/biz/model-base/decorator/attribute';

export default class MSightSection extends BaseModel {
  id = 0;

  name = '';

  sort = 0;

  @format('datetime', 'save')
  createdAt = '';

  @format('datetime', 'save')
  updatedAt = '';

  toSubmit() {
    return {
      id: this.id,
      name: this.name,
      sort: this.sort,
    };
  }
}
