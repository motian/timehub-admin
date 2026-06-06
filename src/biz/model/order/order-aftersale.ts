import { AFTERSALE_REFUND_STATUS_OPTIONS } from '@/biz/const/order';
import BaseModel from '@/biz/model-base/common/base-model';
import { format } from '@/biz/model-base/decorator/attribute';

export default class MOrderAftersale extends BaseModel {
  aftersaleOrderNo = '';

  type = 0;

  orderNo = '';

  contactMobile = '';

  remark = '';

  refundAmount = 0;

  @format('option', AFTERSALE_REFUND_STATUS_OPTIONS)
  refundStatus = 0;

  @format('datetime', 'save')
  createdAt = '';

  @format('datetime', 'save')
  processAt = '';

  @format('datetime', 'save')
  refundAt = '';
}
