import { useUserStore } from '@/store';
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

export default function usePermission() {
  const userStore = useUserStore();

  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      if (!route.meta?.requiresAuth) return true;

      const routeName = String(route.name);
      if (!userStore.userInfo?._routeMap?.[routeName]) {
        return false;
      }

      return (
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.includes(userStore.currentRole)
      );
    },
  };
}
