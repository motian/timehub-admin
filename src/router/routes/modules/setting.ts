import { DEFAULT_LAYOUT } from '@/router/constants';
import { AppRouteRecordRaw } from '../types';
import SettingAdminTabs from './tabs/setting-admin';

const LIST: AppRouteRecordRaw = {
  path: '/setting',
  name: 'Setting',
  redirect: '/setting/admin',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '系统管理',
    requiresAuth: true,
    icon: 'icon-settings',
    hideChildrenInMenu: false,
    order: 5,
    activeMenu: 'SettingAdmin',
  },
  children: [
    {
      path: 'admin',
      name: 'SettingAdmin',
      component: () => import('@/views/setting/admin/index.vue'),
      meta: {
        locale: '成员管理',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'SettingAdmin',
        tabs: SettingAdminTabs,
      },
    },
    {
      path: 'team',
      name: 'SettingTeam',
      component: () => import('@/views/setting/team/index.vue'),
      meta: {
        locale: '团队管理',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
        activeMenu: 'SettingAdmin',
        tabs: SettingAdminTabs,
      },
    },
  ],
};

export default LIST;
