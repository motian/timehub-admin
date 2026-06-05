import { ORDER_STATUS_OPTIONS } from '@/biz/const/order';
import BaseModel from '@/biz/model-base/common/base-model';
import { format, itemModel } from '@/biz/model-base/decorator/attribute';
import MOrderAftersale from './order-aftersale';
import MOrderMember from './order-member';
import MOrderProduct from './order-product';
import MOrderUser from './order-user';
import MOrderVerify from './order-verify';

export default class MOrder extends BaseModel {
  id = 0;

  orderNo = '';

  type = 1;

  @format('option', ORDER_STATUS_OPTIONS)
  status = 0;

  userId = 0;

  payAmount = 0;

  transactionId = '';

  remark = '';

  cancelReason = '';

  leftPaySeconds = 0;

  @format('datetime', 'save')
  createdAt = '';

  @format('datetime', 'save')
  paidAt = '';

  @format('datetime', 'save')
  verifiedAt = '';

  @format('datetime', 'save')
  canceledAt = '';

  @format('datetime', 'save')
  finishedAt = '';

  @itemModel(MOrderUser)
  user: MOrderUser = new MOrderUser();

  @itemModel(MOrderProduct)
  product: MOrderProduct = new MOrderProduct();

  @itemModel(MOrderMember)
  members: MOrderMember[] = [];

  @itemModel(MOrderVerify)
  verifies: MOrderVerify[] = [];

  @itemModel(MOrderAftersale)
  aftersale: MOrderAftersale | null = null;
}
