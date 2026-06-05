import { getOptions } from './common';
import dayjs from 'dayjs';

export const PRODUCT_TYPE_OPTIONS = [
  { label: '活动', value: 1 },
  { label: '积分商品', value: 2 },
];

export const PRODUCT_STATUS_OPTIONS = getOptions(['上架中', '已下架']);

export const PRODUCT_FEE_TYPE_OPTIONS = getOptions(['免费', '收费']);

export enum ProductStatus {
  ONLINE = 1,
  OFFLINE = 2,
}

export enum ProductType {
  ACTIVITY = 1,
  CREDIT = 2,
}

export function isActivityProduct(type: number) {
  return type === ProductType.ACTIVITY;
}

export function isCreditProduct(type: number) {
  return type === ProductType.CREDIT;
}

/** 活动是否尚未开始（与后端 CancelActivity 一致：无开始时间或未到达开始时间） */
export function isActivityNotStarted(startAt?: string) {
  if (!startAt) return true;
  return dayjs().isBefore(dayjs(startAt));
}

/** 是否可取消活动：活动类 + 上架中 + 尚未开始 */
export function canCancelActivity(record: {
  type: number;
  status: number;
  startAt?: string;
}) {
  if (!isActivityProduct(record.type)) return false;
  if (record.status !== ProductStatus.ONLINE) return false;
  return isActivityNotStarted(record.startAt);
}
