<script setup lang="ts">
  import { isBoolean } from 'lodash-es';
  import { PropType } from 'vue';
  import { useRouter } from 'vue-router';

  const props = defineProps({
    title: {
      type: String as PropType<string>,
      default: '',
    },
    back: {
      type: [Object, Boolean] as PropType<{ path: string } | boolean>,
      default: false,
    },
  });

  const router = useRouter();

  const onBack = () => {
    if (!isBoolean(props.back) && props.back.path) {
      window.location.href = props.back.path;
      return;
    }
    router.back();
  };
</script>

<template>
  <div class="top-bar">
    <a-link v-if="back" class="wm-r-6" @click="onBack">
      <icon-left /> 返回
    </a-link>
    <span>{{ title }}</span>
  </div>
</template>

<style lang="less" scoped>
  .top-bar {
    position: sticky;
    top: 0;
    z-index: 1; /* Add this line */
    display: flex;
    align-items: center;
    width: 100%;
    height: 45px;
    margin-left: 1px;
    padding: 0 15px;
    font-weight: 500;
    font-size: 15px;
    background-color: white;
    border-bottom: solid 1px @color-border-2;
  }
</style>
