<template>
  <a-layout class="layout" :class="{ mobile: appStore.hideMenu }">
    <div v-if="navbar" class="layout-navbar">
      <NavBar />
    </div>
    <a-layout>
      <a-layout>
        <a-layout-sider
          v-if="renderMenu"
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{ paddingTop: navbarHeight }"
          :hide-trigger="true"
          @collapse="setCollapsed"
        >
          <div class="menu-wrapper">
            <Menu />
          </div>
        </a-layout-sider>
        <a-drawer
          v-if="hideMenu"
          :visible="drawerVisible"
          placement="left"
          :footer="false"
          mask-closable
          :closable="false"
          @cancel="drawerCancel"
        >
          <Menu />
        </a-drawer>
        <a-layout class="layout-content" :style="paddingStyle">
          <TabBar v-if="appStore.tabBar" />
          <a-layout-content>
            <div class="layout-content-container">
              <!-- 如果只有一个 tab， 则不显示 top-tabs，直接显示 top-bar -->
              <h-top-tabs
                v-if="topTabs.length > 1"
                :style="topTabsStyle"
                :tabs="topTabs"
                :tab-active="route.name"
              />
              <h-top-bar
                v-else-if="showTopBar"
                :title="route.params.locale || route.meta.locale"
                :back="route.meta.back"
              />
              <PageLayout class="page-layout" />
            </div>
          </a-layout-content>
          <Footer v-if="footer" />
        </a-layout>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import useScreenSize from '@/biz/hooks/common/screen';
  import Footer from '@/components/footer/index.vue';
  import Menu from '@/components/menu/index.vue';
  import NavBar from '@/components/navbar/index.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import usePermission from '@/hooks/permission';
  import useResponsive from '@/hooks/responsive';
  import { useAppStore, useUserStore } from '@/store';
  import { isUndefined } from 'lodash-es';
  import { computed, provide, ref, watch } from 'vue';
  import { RouteRecordRaw, useRoute, useRouter } from 'vue-router';
  import PageLayout from './page-layout.vue';

  interface RouteMetaTabItem {
    title: string;
    key: string;
  }

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { topTabsStyle } = useScreenSize();
  const router = useRouter();
  const route = useRoute();
  const permission = usePermission();
  useResponsive(true);
  const isHomePage = computed(() => route.name === 'index');
  const navbarHeight = computed(() => (navbar.value ? `60px` : '0'));
  const navbar = computed(
    () => (appStore.navbar && route.meta.requiresAuth) || isHomePage.value
  );
  const renderMenu = computed(() => appStore.menu && route.meta.requiresAuth);
  const hideMenu = computed(() => appStore.hideMenu);
  const footer = computed(() => appStore.footer);
  const showTopBar = computed(() => {
    return isUndefined(route.meta.showTopBar) || route.meta.showTopBar;
  });
  const menuWidth = computed(() => {
    return appStore.menuCollapse ? 48 : appStore.menuWidth;
  });
  const collapsed = computed(() => {
    return appStore.menuCollapse;
  });
  const topTabs = computed(() => {
    if (!route.meta.tabs) {
      return [];
    }
    const metaTabs = route.meta.tabs as RouteMetaTabItem[];
    const metaRouterNames = metaTabs.map((tabItem) => tabItem.key);
    const metaRoutes: RouteRecordRaw[] = [];
    router.options.routes.forEach((routeItem) => {
      const children = routeItem.children || [];
      const routes = children.filter((childItem) => {
        return metaRouterNames.includes(String(childItem.name));
      });
      metaRoutes.push(...routes);
    });
    const accessableRouteNames = metaRoutes
      .filter((routeItem) => {
        return permission.accessRouter(routeItem);
      })
      .map((routeItem) => String(routeItem.name));

    const { userInfo } = userStore;
    return metaTabs
      .filter((tabItem) => accessableRouteNames.includes(tabItem.key))
      .filter(
        (tabItem: any) => !tabItem.onlySuperManager || userInfo.isSuperManager
      );
  });
  const paddingStyle = computed(() => {
    const paddingLeft =
      renderMenu.value && !hideMenu.value
        ? { paddingLeft: `${menuWidth.value}px` }
        : {};
    const paddingTop = navbar.value ? { paddingTop: navbarHeight.value } : {};
    return { ...paddingLeft, ...paddingTop };
  });
  const setCollapsed = (val: boolean) => {
    appStore.updateSettings({ menuCollapse: val });
  };
  watch(
    () => userStore.currentRole,
    (roleValue) => {
      if (roleValue && !permission.accessRouter(route))
        router.push({ name: 'notFound' });
    }
  );
  const drawerVisible = ref(false);
  const drawerCancel = () => {
    drawerVisible.value = false;
  };
  provide('toggleDrawerMenu', () => {
    drawerVisible.value = !drawerVisible.value;
  });
</script>

<style scoped lang="less">
  @nav-size-height: v-bind(navbarHeight);
  @layout-max-width: 1100px;

  .layout {
    width: 100%;
    height: 100%;
  }

  .layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: @nav-size-height;
  }

  .layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    &::after {
      position: absolute;
      top: 0;
      right: -1px;
      display: block;
      width: 1px;
      height: 100%;
      background-color: var(--color-border);
      content: '';
    }

    > :deep(.arco-layout-sider-children) {
      overflow-y: hidden;
    }
  }

  .menu-wrapper {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;

    :deep(.arco-menu) {
      .arco-menu-icon {
        margin-right: 10px;
      }

      .arco-menu-item:not(.arco-menu-has-icon) {
        padding: 0 6px;
      }

      ::-webkit-scrollbar {
        width: 3px;
        height: 4px;
      }

      ::-webkit-scrollbar-thumb {
        background-color: var(--color-fill-3);
        background-clip: padding-box;
        // border: 4px solid transparent;
        border-radius: 7px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: var(--color-text-3);
      }
    }
  }

  .layout-content {
    min-height: 100vh;
    overflow-y: hidden;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    &-container {
      height: calc(100vh - @nav-size-height);
      overflow-y: scroll;

      .page-layout {
        // top-bar or top-tabs height is 45px
        height: calc(100% - 45px);
      }
    }
  }
</style>
