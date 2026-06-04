import { getOptions } from './common';

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
