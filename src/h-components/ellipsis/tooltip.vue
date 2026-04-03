<script lang="ts" setup>
  import { PropType } from 'vue';

  defineProps({
    content: {
      type: String as PropType<string>,
      default: '',
    },
    line: {
      type: Number as PropType<number>,
      default: 1,
    },
  });
</script>

<template>
  <a-tooltip :content-style="{ padding: 0, maxWidth: '500px' }">
    <span class="ellipsis">{{ content }}</span>
    <template #content>
      <a-scrollbar
        style="
          max-height: 380px;
          padding: 10px;
          overflow: auto;
          font-size: 13px;
        "
      >
        <span style="white-space: pre-line">
          {{ content }}
        </span>
      </a-scrollbar>
    </template>
  </a-tooltip>
</template>

<style scoped lang="less">
  .ellipsis {
    display: -webkit-box;
    // css 实现两行或多行文本溢出显示省略号
    // https://segmentfault.com/a/1190000022474073
    overflow: hidden;
    white-space: pre-line;
    text-overflow: ellipsis;
    -webkit-line-clamp: v-bind(line); //多行在这里修改数字即可

    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
  }
</style>
