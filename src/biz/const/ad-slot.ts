/** 与 timehub-api model/ad_slot 一致 */
export const AD_SLOT_REDIRECT_TYPE_OPTIONS = [
  { label: '文章', value: 1 },
  { label: '公众号', value: 2 },
  { label: '视频号', value: 3 },
];

export enum AdSlotType {
  IMAGE = 1,
  AI = 2,
}

export enum AdSlotRedirectType {
  ARTICLE = 1,
  OFFICIAL_ACCOUNT = 2,
  VIDEO_CHANNEL = 3,
}

export interface AdSlotVideoRedirectData {
  finderUserName: string;
  feedId: string;
}
