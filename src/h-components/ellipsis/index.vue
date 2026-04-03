<script lang="ts" setup>
  import { ref, computed, PropType } from 'vue';

  const props = defineProps({
    content: {
      type: String as PropType<string>,
      default: '',
    },
    line: {
      type: Number as PropType<number>,
      default: 1,
    },
  });

  const contentRef = ref();
  const expanded = ref(false);

  const showline = computed(() => {
    return expanded.value ? 0 : props.line;
  });

  const showExpanded = computed(() => {
    const scrollHeight = contentRef.value?.scrollHeight || 0;
    const clientHeight = contentRef.value?.clientHeight || 0;
    return scrollHeight > clientHeight;
  });
</script>

<template>
  <div>
    <div ref="contentRef" class="ellipsis">
      <slot v-if="$slots.content" name="content" />
      <span v-else>{{ content }}</span>
    </div>
    <template v-if="showExpanded">
      <a-link v-if="!expanded" @click="expanded = true">
        <icon-double-down />展开
      </a-link>
      <a-link v-else @click="expanded = false"> <icon-double-up />收起 </a-link>
    </template>
  </div>
</template>

<style scoped lang="less">
  .ellipsis {
    display: -webkit-box;
    // css 实现两行或多行文本溢出显示省略号
    // https://segmentfault.com/a/1190000022474073
    overflow: hidden;
    white-space: pre-line;
    text-overflow: ellipsis;
    -webkit-line-clamp: v-bind(showline); //多行在这里修改数字即可

    /* autoprefixer: ignore next */
    -webkit-box-orient: vertical;
  }
</style>
