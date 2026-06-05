import { PRODUCT_FEE_TYPE_OPTIONS } from '@/biz/const/product';
import BaseModel from '@/biz/model-base/common/base-model';
import { format } from '@/biz/model-base/decorator/attribute';

export default class MOrderProduct extends BaseModel {
  productId = 0;

  productType = 1;

  title = '';

  cover = '';

  @format('option', PRODUCT_FEE_TYPE_OPTIONS)
  feeType = 1;

  unitPrice = 0;

  credit = 0;

  quantity = 0;

  totalAmount = 0;

  startAt = '';

  shortAddress = '';

  fullAddress = '';
}
