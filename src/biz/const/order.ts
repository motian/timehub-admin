import { getOptions } from './common';

export enum OrderStatus {
  WAIT_PAY = 11,
  WAIT_PAY_CANCELED = 12,
  PAID = 21,
  PART_VERIFIED = 31,
  VERIFIED = 32,
  AFTERSALE_ING = 51,
  AFTERSALE_FINISHED = 52,
}

export const ORDER_STATUS_OPTIONS = [
  { label: '待支付', value: OrderStatus.WAIT_PAY },
  { label: '已取消', value: OrderStatus.WAIT_PAY_CANCELED },
  { label: '待核销', value: OrderStatus.PAID },
  { label: '部分核销', value: OrderStatus.PART_VERIFIED },
  { label: '已核销', value: OrderStatus.VERIFIED },
  { label: '退款中', value: OrderStatus.AFTERSALE_ING },
  { label: '已退款', value: OrderStatus.AFTERSALE_FINISHED },
];

export enum OrderVerifyStatus {
  PENDING = 1,
  VERIFIED = 2,
  CANCELED = 3,
}

export const ORDER_VERIFY_STATUS_OPTIONS = getOptions([
  '待核销',
  '已核销',
  '已作废',
]);

export enum AftersaleType {
  USER_CANCEL = 1,
  ADMIN_REFUND = 10,
  SCHEDULE_CANCEL = 11,
}

export enum AftersaleRefundStatus {
  WAIT_ACCEPT = 10,
  REFUNDING = 20,
  SUCCESS = 30,
  FAIL = 40,
}

export const AFTERSALE_REFUND_STATUS_OPTIONS = [
  { label: '待受理', value: AftersaleRefundStatus.WAIT_ACCEPT },
  { label: '退款中', value: AftersaleRefundStatus.REFUNDING },
  { label: '退款完成', value: AftersaleRefundStatus.SUCCESS },
  { label: '退款失败', value: AftersaleRefundStatus.FAIL },
];

export const REFUNDABLE_ORDER_STATUSES = [
  OrderStatus.PAID,
  OrderStatus.PART_VERIFIED,
  OrderStatus.VERIFIED,
  OrderStatus.AFTERSALE_ING,
];

export function isOrderRefundable(status: number) {
  return REFUNDABLE_ORDER_STATUSES.includes(status);
}

/** 活动订单快照 feeType=1 为免费活动（实付为 0，走 0 元售后完结） */
export function isFreeActivityOrder(
  order?: { product?: { feeType?: number } } | null
) {
  return order?.product?.feeType === 1;
}

/** 列表操作按钮文案（四字）：免费=取消报名，收费=提交退款 */
export function getOrderListRefundActionLabel(
  order?: { product?: { feeType?: number } } | null
) {
  return isFreeActivityOrder(order) ? '取消报名' : '提交退款';
}

export function isScheduleCancelAftersale(
  aftersale?: { type?: number } | null
) {
  return aftersale?.type === AftersaleType.SCHEDULE_CANCEL;
}

export function canCancelAftersale(
  aftersale?: { refundStatus?: number; type?: number } | null
) {
  return (
    aftersale?.refundStatus === AftersaleRefundStatus.WAIT_ACCEPT &&
    !isScheduleCancelAftersale(aftersale)
  );
}
