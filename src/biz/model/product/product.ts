import {
  PRODUCT_FEE_TYPE_OPTIONS,
  PRODUCT_SMS_VERIFY_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
} from '@/biz/const/product';
import BaseModel from '@/biz/model-base/common/base-model';
import { format, itemModel } from '@/biz/model-base/decorator/attribute';
import MMedia from '../media/media';
import MProductPoi from './product-poi';

export default class MProduct extends BaseModel {
  id = 0;

  @format('option', PRODUCT_TYPE_OPTIONS)
  type = 1;

  title = '';

  cover = '';

  tag = '';

  shortAddress = '';

  fullAddress = '';

  @itemModel(MProductPoi)
  poiInfo = new MProductPoi();

  @format('datetime', 'save')
  startAt = '';

  memberLimit = 0;

  memberMin = 0;

  stock = 0;

  @format('option', PRODUCT_FEE_TYPE_OPTIONS)
  feeType = 1;

  salePrice = 0;

  credit = 0;

  content = '';

  @format('option', PRODUCT_SMS_VERIFY_OPTIONS)
  smsVerifyEnabled = 2;

  @format('option', PRODUCT_STATUS_OPTIONS)
  status = 2;

  @itemModel(MMedia)
  images: MMedia[] = [];

  activityMemberCount = 0;

  @format('datetime', 'save')
  createdAt = '';

  @format('datetime', 'save')
  updatedAt = '';

  fromJson() {
    if (!this.poiInfo) {
      this.poiInfo = new MProductPoi();
    }
    if (this.feeType === 1) {
      this.salePrice = 0;
    }
    if (!this.smsVerifyEnabled) {
      this.smsVerifyEnabled = 2;
    }
  }

  toSubmit() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      cover: this.cover,
      tag: this.tag,
      shortAddress: this.shortAddress,
      fullAddress: this.fullAddress,
      poiInfo: this.poiInfo,
      startAt: this.startAt || undefined,
      memberLimit: this.memberLimit,
      memberMin: this.memberMin,
      stock: this.stock,
      feeType: this.feeType,
      salePrice: this.feeType === 2 ? this.salePrice : 0,
      credit: this.credit,
      content: this.content,
      smsVerifyEnabled: this.smsVerifyEnabled,
      status: this.status,
    };
  }
}
