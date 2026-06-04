import { DEFAULT_LAYOUT } from '@/router/constants';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/article',
  name: 'Article',
  redirect: '/article/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '拾光圈',
    requiresAuth: true,
    icon: 'icon-archive',
    hideChildrenInMenu: true,
    order: 4,
  },
  children: [
    {
      path: 'list',
      name: 'ArticleList',
      component: () => import('@/views/article/index.vue'),
      meta: {
        locale: '拾光圈',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Article',
      },
    },
    {
      path: 'editor',
      name: 'ArticleEditor',
      component: () => import('@/views/article/editor.vue'),
      meta: {
        locale: '编辑文章',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
        activeMenu: 'Article',
      },
    },
  ],
};

export default LIST;
