import { DEFAULT_LAYOUT } from '@/router/constants';
import { AppRouteRecordRaw } from '../types';

const OPERATION: AppRouteRecordRaw = {
  path: '/operation',
  name: 'Operation',
  redirect: '/operation/ad-slot/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '运营管理',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 1,
  },
  children: [
    {
      path: 'ad-slot/list',
      name: 'AdSlotList',
      component: () => import('@/views/operation/ad-slot/index.vue'),
      meta: {
        locale: '首页图片位',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'ad-slot/editor',
      name: 'AdSlotEditor',
      component: () => import('@/views/operation/ad-slot/editor.vue'),
      meta: {
        locale: '编辑图片位',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
        activeMenu: 'AdSlotList',
      },
    },
    {
      path: 'community/list',
      name: 'CommunityList',
      component: () => import('@/views/operation/community/index.vue'),
      meta: {
        locale: '社区烟火气',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default OPERATION;
