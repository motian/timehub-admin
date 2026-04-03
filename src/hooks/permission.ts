import { useUserStore } from '@/store';
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

export default function usePermission() {
  const userStore = useUserStore();

  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      if (!route.meta?.requiresAuth) return true;

      return (
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.includes(userStore.currentRole)
      );
    },
  };
}
