import BaseModel from '@/biz/model-base/common/base-model';

export default class MAdminManagedData extends BaseModel {
  // 维护数 = 售维护数 + 租维护数
  maintainCount = 0;

  // 售维护数
  saleCount = 0;

  // 租维护数
  rentCount = 0;

  // 实勘数
  suveryCount = 0;

  // 录入数
  creatorCount = 0;

  // 客户数
  customerCount = 0;
}
