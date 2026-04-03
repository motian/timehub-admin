import useAdminMenuApi from '@/biz/hooks/admin/admin-menu';
import appClientMenus from '@/router/appMenus';
import { ref } from 'vue';

export default function useAdminPermissions() {
  const { getCurrentMenuList } = useAdminMenuApi();

  const buildRoutePermission = async () => {
    const menus = await getCurrentMenuList();
    const menuMap = ref<any>({});
    const routeMap = ref<any>({});

    // 生成菜单权限
    menuMap.value = menus.reduce((acc, item) => {
      if (item.items) {
        item.items.forEach((child: any) => {
          acc[child.path] = true;
        });
      }
      return acc;
    }, {} as any);

    // 生成路由权限
    appClientMenus.forEach((menu) => {
      if (menu.children) {
        const menuName = String(menu.name);
        let hasChildPermission = false;
        menu.children.forEach((child) => {
          // 如果当前路由有菜单权限，则当前路由也有权限
          const childName = String(child.name);
          const childPath = `${menu.path}/${child.path}`.replace(/^\//g, '');
          if (menuMap.value[childPath]) {
            routeMap.value[childName] = {
              isMenu: true,
            };
            hasChildPermission = true;
          }
        });
        menu.children.forEach((child) => {
          // 如果当前路由的 activeMenu 有菜单权限，则当前路由也有权限
          const childName = String(child.name);
          const activeMenuName = child.meta?.activeMenu;
          if (
            activeMenuName &&
            routeMap.value[activeMenuName] &&
            !routeMap.value[childName]
          ) {
            routeMap.value[childName] = {
              isMenu: false,
            };
          }
        });

        // 如果当前路由存在子路由有权限，则当前路由也有权限
        if (hasChildPermission) {
          routeMap.value[menuName] = {
            order: menu.meta.order,
            isMenu: true,
          };
        }
      }
    });

    return routeMap;
  };

  return {
    buildRoutePermission,
  };
}
