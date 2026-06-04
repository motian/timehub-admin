import { DEFAULT_LAYOUT } from '@/router/constants';
import { AppRouteRecordRaw } from '../types';

const SIGHT: AppRouteRecordRaw = {
  path: '/sight',
  name: 'Sight',
  redirect: '/sight/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '逛集探村',
    requiresAuth: true,
    icon: 'icon-compass',
    order: 7,
  },
  children: [
    {
      path: 'list',
      name: 'SightList',
      component: () => import('@/views/sight/index.vue'),
      meta: {
        locale: '市集管理',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Sight',
      },
    },
    {
      path: 'editor',
      name: 'SightEditor',
      component: () => import('@/views/sight/editor.vue'),
      meta: {
        locale: '编辑市集',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
        activeMenu: 'Sight',
      },
    },
    {
      path: 'section',
      name: 'SightSection',
      component: () => import('@/views/sight-section/index.vue'),
      meta: {
        locale: '栏目管理',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Sight',
      },
    },
  ],
};

export default SIGHT;
