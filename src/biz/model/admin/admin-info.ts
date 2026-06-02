import { getOptions } from '@/biz/const/common';
import CUser from '@/biz/const/user';
import BaseModel from '@/biz/model-base/common/base-model';
import { format, itemModel } from '@/biz/model-base/decorator/attribute';
import MAdminTeam from './admin-team';

const DEFAULT_AVATAR = 'https://cdn.hetu.yun/FktH8PqQg-7cNVKdEVvTbNiVRXz9';

export default class MAdminInfo extends BaseModel {
  id = 0;

  teamId = 0;

  name = '';

  mobile = '';

  avatar = '';

  @format('option', getOptions(CUser.Gender))
  gender = 1;

  roleId = 0;

  roleName = '';

  @format('option', getOptions(['启用', '禁用']))
  status = 0; // 1. 启用 2. 禁用

  remark = '';

  creatorId = 0;

  creator: {
    id: number;
    teamId: number;
    name: string;
    mobile: string;
    avatar: string;
    gender: number;
    roleId: number;
  } | null = null;

  @format('datetime', 'save')
  createdAt = '';

  @format('datetime', 'save')
  updatedAt = '';

  @itemModel(MAdminTeam)
  team = new MAdminTeam();

  role = {
    type: 1, // 0 超级管理员 1 系统角色 2 自定义角色
    name: '',
  };

  currentRole = '';

  permission = {};

  fromJson() {
    this.avatar = this.avatar || DEFAULT_AVATAR;
    this.role.name = this.roleName || this.role.name;
    this.currentRole = 'admin';
  }

  get isSuperManager(): boolean {
    return this.role?.type === 0;
  }
}
