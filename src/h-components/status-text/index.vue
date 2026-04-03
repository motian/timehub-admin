<script setup lang="ts">
  import { PropType } from 'vue';

  defineProps({
    type: {
      type: String as PropType<string>,
      default: 'default',
    },
  });
</script>

<template>
  <div class="status" :class="`status-${type}`">
    <div class="icon-round" :class="`icon-round-${type}`"> </div>
    <slot />
  </div>
</template>

<style lang="less" scoped>
  .status {
    display: flex;
    align-items: center;
    margin-right: 5px;

    &-default {
      color: @color-text-3;
    }

    &-primary {
      color: @primary-6;
    }

    &-danger {
      color: @danger-6;
    }

    &-success {
      color: @success-6;
    }

    .icon-round {
      width: 8px;
      height: 8px;
      margin-right: 6px;
      background-color: @primary-6;
      border-radius: 100%;

      &-default {
        background-color: @color-text-3;
      }

      &-primary {
        background-color: @primary-6;
      }

      &-danger {
        background-color: @danger-6;
      }

      &-success {
        background-color: @success-6;
      }
    }
  }
</style>
