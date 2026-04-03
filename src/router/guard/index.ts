import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import setupUserLoginInfoGuard from './userLoginInfo';
import setupPermissionGuard from './permission';
import { useTeamStore } from '@/store';
import { isLogin } from '@/utils/auth';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    if (isLogin()) {
      await useTeamStore().initTeamData();
    }
    // emit route change
    setRouteEmitter(to);
  });
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupUserLoginInfoGuard(router);
  setupPermissionGuard(router);
}
