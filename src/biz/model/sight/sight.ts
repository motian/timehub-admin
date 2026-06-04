import { SIGHT_FEE_TYPE_OPTIONS } from '@/biz/const/sight';
import BaseModel from '@/biz/model-base/common/base-model';
import { format, itemModel } from '@/biz/model-base/decorator/attribute';
import MMedia from '../media/media';

export default class MSight extends BaseModel {
  id = 0;

  title = '';

  brief = '';

  cover = '';

  tag = '';

  shortAddress = '';

  fullAddress = '';

  startDate = '';

  endDate = '';

  startTime = '';

  endTime = '';

  openTimeDesc = '';

  sectionIds: number[] = [];

  @format('option', SIGHT_FEE_TYPE_OPTIONS)
  feeType = 1;

  ticketPrice = 0;

  content = '';

  @itemModel(MMedia)
  images: MMedia[] = [];

  @format('datetime', 'save')
  createdAt = '';

  @format('datetime', 'save')
  updatedAt = '';

  fromJson() {
    if (!this.sectionIds) {
      this.sectionIds = [];
    }
    if (this.feeType === 1) {
      this.ticketPrice = 0;
    }
  }

  toSubmit() {
    return {
      id: this.id,
      title: this.title,
      brief: this.brief,
      cover: this.cover,
      tag: this.tag,
      shortAddress: this.shortAddress,
      fullAddress: this.fullAddress,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
      startTime: this.startTime || undefined,
      endTime: this.endTime || undefined,
      sectionIds: this.sectionIds || [],
      feeType: this.feeType,
      ticketPrice: this.feeType === 2 ? this.ticketPrice : 0,
      content: this.content,
    };
  }
}
