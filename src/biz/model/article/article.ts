import { ARTICLE_TYPE_OPTIONS } from '@/biz/const/article';
import { getOptions } from '@/biz/const/common';
import BaseModel from '@/biz/model-base/common/base-model';
import { format, itemModel } from '@/biz/model-base/decorator/attribute';
import MMedia from '../media/media';

export default class MArticle extends BaseModel {
  id = 0;

  code = '';

  @format('option', ARTICLE_TYPE_OPTIONS)
  type = 1;

  cover = '';

  title = '';

  content = '';

  @itemModel(MMedia)
  images: MMedia[] = [];

  @format('option', getOptions(['上架中', '已下架']))
  status = 1;

  @format('datetime', 'save')
  publishAt = '';

  @format('datetime', 'save')
  unpublishAt = '';

  viewCount = 0;

  likeCount = 0;

  url = '';

  creatorId = 0;

  creator = {
    name: '',
  };

  lastOperator = {
    name: '',
  };

  @format('datetime', 'save')
  createdAt = '';

  toSubmit() {
    return {
      id: this.id,
      type: this.type,
      cover: this.cover,
      title: this.title,
      content: this.content,
      status: this.status,
      publishAt: this.publishAt || undefined,
      unpublishAt: this.unpublishAt || undefined,
    };
  }
}
