<script setup lang="ts">
  import { PropType } from 'vue';

  const props = defineProps({
    src: {
      type: String as PropType<string>,
      default: '',
    },
    level: {
      type: String as PropType<string>,
      default: '',
    },
    size: {
      type: Number as PropType<number>,
      default: 40,
    },
  });

  const levelColor = () => {
    const colorMap: any = {
      'A': '#f53f3f',
      'B': '#ffb400',
      'C': '#168cff',
      'D': '#14c9c9',
      '': '#86909c',
    };
    return colorMap[props.level] || 'gray';
  };
</script>

<template>
  <a-badge
    v-if="level"
    :text="level"
    :dot-style="{ background: levelColor() }"
    :offset="[0, size - 10]"
    class="customer-avatar"
  >
    <a-avatar :size="size">
      <img v-if="src" alt="avatar" :src="src" />
      <div v-else>A</div>
    </a-avatar>
  </a-badge>
  <a-avatar v-else :size="size">
    <img v-if="src" alt="avatar" :src="src" />
    <div v-else>A</div>
  </a-avatar>
</template>

<style lang="less" scoped>
  .avatar {
    border-radius: 100%;
  }
</style>
