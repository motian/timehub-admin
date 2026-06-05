import { DEFAULT_LAYOUT } from '@/router/constants';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'User',
  redirect: '/user/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '用户管理',
    requiresAuth: true,
    icon: 'icon-user',
    hideChildrenInMenu: true,
    order: 6,
  },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/user/index.vue'),
      meta: {
        locale: '用户列表',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'User',
      },
    },
    {
      path: 'detail/:id',
      name: 'UserDetail',
      component: () => import('@/views/user/detail/index.vue'),
      meta: {
        locale: '用户详情',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
        activeMenu: 'UserList',
        back: true,
      },
    },
  ],
};

export default USER;
