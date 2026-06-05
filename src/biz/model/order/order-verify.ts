import { ORDER_VERIFY_STATUS_OPTIONS } from '@/biz/const/order';
import BaseModel from '@/biz/model-base/common/base-model';
import { format } from '@/biz/model-base/decorator/attribute';

export default class MOrderVerify extends BaseModel {
  seq = 0;

  verifyCode = '';

  @format('option', ORDER_VERIFY_STATUS_OPTIONS)
  status = 1;

  credit = 0;

  @format('datetime', 'save')
  verifiedAt = '';
}
