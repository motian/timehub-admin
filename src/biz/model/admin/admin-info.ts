import { getOptions } from '@/biz/const/common';
import CUser from '@/biz/const/user';
import BaseModel from '@/biz/model-base/common/base-model';
import { format, itemModel } from '@/biz/model-base/decorator/attribute';
import { isUndefined } from 'lodash-es';
import MAdminRoleConfig from './admin-role-config';
import MAdminTeam from './admin-team';

const DEFAULT_AVATAR =
  'https://timehub-static.haocode.net/Fgkg_BBy9ke77e5v4aMSmIyTyOIA.png';

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

  @itemModel(MAdminRoleConfig)
  role = new MAdminRoleConfig();

  currentRole = '';

  permission = {};

  _routeMap: Record<string, { isMenu?: boolean; order?: number }> = {};

  fromJson() {
    this.avatar = this.avatar || DEFAULT_AVATAR;
    if (this.roleName && !this.role.name) {
      this.role.name = this.roleName;
    }
    this.currentRole = 'admin';
  }

  get isSuperManager(): boolean {
    return this.role?.type === 0;
  }

  get homePage() {
    const menus = Object.entries(this._routeMap)
      ?.filter(([, value]) => value.isMenu && !isUndefined(value.order))
      ?.sort((a, b) => (a[1].order || 0) - (b[1].order || 0));
    return menus?.[0]?.[0] || 'noPermission';
  }
}
