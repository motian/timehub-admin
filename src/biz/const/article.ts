import { getOptions } from './common';

export enum ArticleType {
  ARTICLE = 1,
  OFFICIAL_ACCOUNT = 2,
  /** 保留类型，后台不可新建 */
  VIDEO_CHANNEL = 3,
  AGREEMENT = 4,
}

/** 含保留类型，用于列表展示、模型 format */
export const ARTICLE_TYPE_ALL_OPTIONS = [
  { label: '文章', value: ArticleType.ARTICLE },
  { label: '公众号', value: ArticleType.OFFICIAL_ACCOUNT },
  { label: '视频号', value: ArticleType.VIDEO_CHANNEL },
  { label: '用户协议', value: ArticleType.AGREEMENT },
];

/** 后台可选分类（不含视频号） */
export const ARTICLE_TYPE_OPTIONS = ARTICLE_TYPE_ALL_OPTIONS.filter(
  (item) => item.value !== ArticleType.VIDEO_CHANNEL
);

export const ARTICLE_AGREEMENT_TYPE_OPTIONS = [
  { label: '个人信息保护指引', value: 1 },
  { label: '拾光巷用户服务协议', value: 2 },
  { label: '活动报名须知与服务协议', value: 3 },
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
  return type === ArticleType.ARTICLE;
}

/** 公众号：封面 + 外链 */
export function isOfficialAccountArticle(type: number) {
  return type === ArticleType.OFFICIAL_ACCOUNT;
}

/** 用户协议：需选择 agreementType */
export function isAgreementArticle(type: number) {
  return type === ArticleType.AGREEMENT;
}

export function needsCover(type: number) {
  return isOperationArticle(type) || isOfficialAccountArticle(type);
}

export function needsCarouselImages(type: number) {
  return isOperationArticle(type);
}
