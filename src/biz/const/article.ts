import { getOptions } from './common';

export const ARTICLE_TYPE_OPTIONS = [
  { label: '文章', value: 1 },
  { label: '公众号', value: 2 },
  { label: '个人信息保护指引', value: 11 },
  { label: '拾光巷用户服务协议', value: 12 },
  { label: '活动报名须知与服务协议', value: 13 },
];

export const ARTICLE_STATUS_OPTIONS = getOptions([
  '上架中',
  '已下架',
  '待生效',
]);

export enum ArticleStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  PENDING = 3,
}

/** 运营文章：需要封面与轮播图 */
export function isOperationArticle(type: number) {
  return type === 1;
}

/** 公众号：封面 + 外链 */
export function isOfficialAccountArticle(type: number) {
  return type === 2;
}

/** 协议类：仅标题与正文 */
export function isAgreementArticle(type: number) {
  return [11, 12, 13].includes(type);
}

export function needsCover(type: number) {
  return isOperationArticle(type) || isOfficialAccountArticle(type);
}

export function needsCarouselImages(type: number) {
  return isOperationArticle(type);
}
