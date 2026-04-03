<script setup lang="ts">
  import { ref, computed, PropType } from 'vue';

  interface MediaItem {
    id: string;
    cover: string;
    url: string;
    isVideo: boolean;
  }

  const props = defineProps({
    mediaList: {
      type: Array as PropType<MediaItem[]>,
    },
    width: {
      type: Number as PropType<number>,
      default: 0,
    },
    height: {
      type: Number as PropType<number>,
      default: 0,
    },
    margin: {
      type: String,
      default: '5px 5px 0 0',
    },
  });

  const preview = ref({
    show: false,
    current: 0,
  });

  const previewImages = computed(() => {
    return (
      props.mediaList?.filter((media) => {
        return !media.isVideo;
      }) || []
    );
  });

  function onMediaClick(media: MediaItem) {
    if (media.isVideo) {
      window.open(media.url);
      return;
    }
    preview.value.show = true;
    preview.value.current = previewImages.value.findIndex(
      (image) => image.cover === media.cover
    );
  }
</script>

<template>
  <a-image-preview-group
    v-model:visible="preview.show"
    v-model:current="preview.current"
    infinite
    :src-list="previewImages.map((image) => image.cover)"
  />
  <div class="media-list">
    <div v-for="media in mediaList" :key="media.id" :style="{ margin }">
      <h-cover
        :preview="false"
        :width="width"
        :height="height"
        :src="media.cover"
        :is-video="media.isVideo"
        @click="onMediaClick(media)"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
  .media-list {
    display: flex;
    flex-direction: row;
  }
</style>
