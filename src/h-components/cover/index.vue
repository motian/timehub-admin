<script setup lang="ts">
  import { computed, PropType } from 'vue';

  const props = defineProps({
    isVideo: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    width: {
      type: Number as PropType<number>,
      default: 0,
    },
    height: {
      type: Number as PropType<number>,
      default: 0,
    },
    tag: {
      type: String as PropType<string>,
      default: '',
    },
  });

  const contentStyle = computed(() => {
    return {
      width: `${props.width}px`,
      height: '100%',
    };
  });
</script>

<template>
  <div class="image-content" :style="contentStyle">
    <a-image
      :preview="false"
      v-bind="$attrs"
      fit="cover"
      :width="width > 0 ? width : undefined"
      :height="height > 0 ? height : undefined"
    >
      <template #error>
        <img
          class="err-img"
          :style="contentStyle"
          :preview="false"
          src="https://cdn.hetu.yun/404.png"
        />
      </template>
    </a-image>
    <div class="image-tag">
      <slot v-if="$slots.tag" name="tag" />
      <span v-else>{{ tag }}</span>
    </div>
    <icon-play-circle v-if="isVideo" class="video-icon" size="35" />
  </div>
</template>

<style lang="less" scoped>
  .image-content {
    position: relative;
    cursor: pointer;

    .err-img {
      object-fit: cover;
    }

    .image-tag {
      position: absolute;
      bottom: 0;
      width: 100%;
      color: white;
      font-weight: normal;
      text-align: center;
      background-color: rgba(33, 39, 42, 0.72);
    }

    .video-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      color: white;
      font-size: 30px;
      border-radius: 100%;
      transform: translate(-50%, -50%);
    }
  }
</style>
