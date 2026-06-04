import BaseModel from '@/biz/model-base/common/base-model';
import { format } from '@/biz/model-base/decorator/attribute';

export default class MCommunity extends BaseModel {
  id = 0;

  title = '';

  cover = '';

  likeCount = 0;

  @format('datetime', 'save')
  createdAt = '';

  @format('datetime', 'save')
  updatedAt = '';

  toSubmit() {
    return {
      id: this.id,
      title: this.title,
      cover: this.cover,
    };
  }
}
