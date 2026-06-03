import BaseModel from '@/biz/model-base/common/base-model';
import { format } from '@/biz/model-base/decorator/attribute';

export default class MMedia extends BaseModel {
  id = 0;

  type = '';

  bizId = 0;

  mimeType = '';

  name = '';

  width = 0;

  height = 0;

  size = 0;

  key = '';

  hash = '';

  sort = 0;

  url = '';

  @format('datetime', 'save')
  createdAt = '';

  fromJson() {
    if (!this.isVideo) {
      this.sort = this.sort || 1000;
    }
  }

  get cover() {
    if (this.isVideo) {
      return `${this.url}?vframe/png/offset/0.1/w/800`;
    }
    return this.url;
  }

  get isVideo() {
    return this.mimeType?.includes('video');
  }
}
