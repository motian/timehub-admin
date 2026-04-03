<script setup lang="ts">
  import { ref, watch, PropType } from 'vue';
  import { useRouter } from 'vue-router';

  const props = defineProps({
    tabs: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    tabActive: {
      type: String,
      default: '',
    },
  });
  const router = useRouter();
  const activeKey = ref(props.tabActive);

  function onChangeTab(key: string | number) {
    const tab = props.tabs.find((tabItem) => tabItem.key === key);
    router.push({
      name: tab.key,
    });
  }

  watch(
    () => props.tabActive,
    () => {
      activeKey.value = props.tabActive;
    }
  );
</script>

<template>
  <div class="container">
    <a-tabs v-model:active-key="activeKey" class="tabbar" @change="onChangeTab">
      <a-tab-pane v-for="tab in tabs" :key="tab.key" :title="tab.title" />
    </a-tabs>
  </div>
</template>

<style lang="less" scoped>
  .container {
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 45px;
    margin-left: 1px;
    background-color: white;

    :deep(.arco-tabs-nav-tab) {
      display: flex;
      align-items: center;
      height: 45px;
      padding: 0 10px;
      background-color: white;
    }

    :deep(.arco-tabs-nav-type-line .arco-tabs-tab) {
      padding: 10px 0;
    }

    .tabbar {
      width: 100%;
    }
  }
</style>
