import { DEFAULT_LAYOUT } from '@/router/constants';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/product',
  name: 'Product',
  redirect: '/product/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '产品管理',
    requiresAuth: true,
    icon: 'icon-gift',
    hideChildrenInMenu: true,
    order: 3,
  },
  children: [
    {
      path: 'list',
      name: 'ProductList',
      component: () => import('@/views/product/index.vue'),
      meta: {
        locale: '产品管理',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Product',
      },
    },
    {
      path: 'editor',
      name: 'ProductEditor',
      component: () => import('@/views/product/editor.vue'),
      meta: {
        locale: '编辑产品',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
        activeMenu: 'ProductList',
      },
    },
  ],
};

export default LIST;
