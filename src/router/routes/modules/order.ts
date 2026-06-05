import { DEFAULT_LAYOUT } from '@/router/constants';
import { AppRouteRecordRaw } from '../types';

const ORDER: AppRouteRecordRaw = {
  path: '/order',
  name: 'Order',
  redirect: '/order/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '订单管理',
    requiresAuth: true,
    icon: 'icon-file',
    hideChildrenInMenu: true,
    order: 4,
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/order/index.vue'),
      meta: {
        locale: '订单管理',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Order',
      },
    },
    {
      path: 'detail/:orderNo',
      name: 'OrderDetail',
      component: () => import('@/views/order/detail/index.vue'),
      meta: {
        locale: '订单详情',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
        activeMenu: 'OrderList',
        back: true,
      },
    },
  ],
};

export default ORDER;
