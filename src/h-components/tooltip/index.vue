<script setup lang="ts">
  import { PropType } from 'vue';

  defineProps({
    backgroundColor: {
      type: String as PropType<string>,
      default: '#fff',
    },
    contentClass: {
      type: String as PropType<string>,
      default: 'h-tooltip-content',
    },
    arrowStyle: {
      type: Object as PropType<any>,
      default: () => {
        return {
          width: '12px',
          height: '12px',
          zIndex: 1,
        };
      },
    },
  });
</script>

<template>
  <a-tooltip
    :background-color="backgroundColor"
    :content-class="contentClass"
    :arrow-style="arrowStyle"
  >
    <template v-for="item in Object.keys($slots)" #[item]="itemData">
      <slot v-if="itemData" :name="item" v-bind="itemData"> </slot>
      <slot v-else :name="item"> </slot>
    </template>
  </a-tooltip>
</template>

<style lang="less">
  .h-tooltip-content {
    padding: 16px !important;
    color: @color-text-1 !important;
    font-size: 12px !important;
    line-height: 18px !important;
    border-radius: 12px !important;
    box-shadow: 0 3px 9px #00000014 !important;
  }
</style>
