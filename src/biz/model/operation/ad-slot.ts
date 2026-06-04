import { AD_SLOT_REDIRECT_TYPE_OPTIONS, AdSlotType } from '@/biz/const/ad-slot';
import BaseModel from '@/biz/model-base/common/base-model';
import { format } from '@/biz/model-base/decorator/attribute';

export default class MAdSlot extends BaseModel {
  id = 0;

  cover = '';

  title = '';

  desc = '';

  type = AdSlotType.IMAGE;

  @format('option', AD_SLOT_REDIRECT_TYPE_OPTIONS)
  redirectType = 1;

  redirectData = '';

  @format('datetime', 'save')
  createdAt = '';

  @format('datetime', 'save')
  updatedAt = '';

  toSubmit() {
    return {
      id: this.id,
      cover: this.cover,
      title: this.title,
      desc: '',
      type: AdSlotType.IMAGE,
      redirectType: this.redirectType,
      redirectData: this.redirectData,
    };
  }
}
