import { getOptions } from '@/biz/const/common';
import CUser, { USER_STATUS_OPTIONS } from '@/biz/const/user';
import BaseModel from '@/biz/model-base/common/base-model';
import { format, itemModel } from '@/biz/model-base/decorator/attribute';
import MUserArea from './user-area';
import MUserOauth from './user-oauth';

export default class MUser extends BaseModel {
  id = 0;

  adminId = 0;

  avatar = '';

  nickName = '';

  name = '';

  @format('option', USER_STATUS_OPTIONS)
  status = 1;

  @format('option', getOptions(CUser.Gender))
  gender = 0;

  mobile = '';

  wechatNo = '';

  @format('date', 'save')
  birthday = '';

  areaCode = '';

  @itemModel(MUserArea)
  area: MUserArea | null = null;

  applyName = '';

  applyMobile = '';

  applyIDNo = '';

  applyEmergMobile = '';

  creditBalance = 0;

  creditUsed = 0;

  creditEarnedYear = 0;

  @format('datetime', 'save')
  lastActiveAt = '';

  @itemModel(MUserOauth)
  userMiniProgram: MUserOauth | null = null;

  @format('datetime', 'save')
  createdAt = '';

  get areaLabel(): string {
    return this.area?.fullName || this.area?.name || '';
  }

  get isStaff(): boolean {
    return this.adminId > 0;
  }
}
