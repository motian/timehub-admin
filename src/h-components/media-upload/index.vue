<template>
  <a-upload
    v-model:file-list="fileList"
    :action="action"
    :data="data"
    :headers="headers"
    :limit="limit"
    image-preview
    list-type="picture-card"
    multiple
    show-remove-button
    response-url-key="url"
    :accept="accept"
    @before-upload="beforeUpload"
    @change="handleChange"
    @exceed-limit="onExceedLimit"
  >
    <template v-if="limit === 1" #upload-button>
      <!-- 单图上传-->
      <div
        v-if="fileList.length === 0"
        class="single-upload"
        :style="imageStyle"
      >
        <div>
          <icon-plus class="icon-plus" :size="25" />
          <div v-if="accept.includes('image') && !accept.includes('video')">
            上传图片
          </div>
          <div
            v-else-if="!accept.includes('image') && accept.includes('video')"
          >
            上传视频
          </div>
          <div v-else> 上传图片/视频 </div>
        </div>
      </div>
    </template>
    <template v-if="limit === 1" #upload-item="{ fileItem, index }">
      <!-- 单图上传-->
      <a-spin class="single-image" :style="imageStyle" :loading="loading">
        <a-image
          v-if="fileItem.response?.mimeType?.startsWith('video')"
          :src="fileItem.url + '?vframe/png/offset/1/w/800'"
          :width="width"
          :height="height"
          :preview="false"
          fit="cover"
        />
        <a-image
          v-else
          :src="fileItem.url"
          :width="width"
          :height="height"
          :preview="false"
          fit="cover"
        />
        <a-image-preview
          v-if="limit !== 1"
          v-model:visible="showImagePreview"
          :src="fileItem.url"
        />
        <div class="cover-bg" @click="showImagePreview = true">
          <icon-delete
            class="icon-delete"
            :size="18"
            @click.stop="onRemoveFile(index)"
          />
        </div>
      </a-spin>
    </template>
    <template v-else #image="{ fileItem }">
      <img
        v-if="fileItem.response.mimeType?.startsWith('video')"
        :src="fileItem.url + '?vframe/png/offset/1/w/800'"
      />
      <img v-else :src="fileItem.url" />
    </template>
  </a-upload>
</template>

<script setup lang="ts">
  import { PropType, ref, computed, watch } from 'vue';
  import { FileItem, Message } from '@arco-design/web-vue';
  import { API } from '@/api';
  import { getToken } from '@/utils/auth';

  export interface UploadItem {
    mimeType?: string;
    name?: string;
    key?: string;
    hash?: string;
    size?: number;
    url: string;
    width?: number;
    height?: number;
  }

  const props = defineProps({
    action: {
      type: String as PropType<string>,
      default: () => `https://${window.uploadDomain}`,
    },
    mediaList: {
      type: Array as PropType<UploadItem[]>,
      default: () => [],
    },
    limit: {
      type: Number as PropType<number>,
      default: 0,
    },
    width: {
      type: Number as PropType<number>,
      default: 80,
    },
    height: {
      type: Number as PropType<number>,
      default: 80,
    },
    maxSize: {
      type: Number as PropType<number>,
      default: 100,
    },
    accept: {
      type: String as PropType<string>,
      default: 'image/jpg,image/jpeg,image/png,video/mp4',
    },
  });
  const emit = defineEmits(['upload', 'remove', 'update:media-list']);

  const data = ref({ token: '' });
  const headers = ref({
    'Authorization': '',
    'X-Corp-Id': '',
  });
  const showImagePreview = ref(false);
  const fileList = ref<FileItem[]>([]);
  const loading = ref(false);

  const imageStyle = computed(() => {
    return {
      width: `${props.width}px`,
      height: `${props.height}px`,
    };
  });

  const updateMediaList = (fileItemList: FileItem[]) => {
    const mediaList = [] as any[];

    fileItemList.forEach((file) => {
      file.response.width = Number(file.response.width);
      file.response.height = Number(file.response.height);
      mediaList.push(file.response);
    });

    emit('update:media-list', mediaList);
    return mediaList;
  };

  const handleChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    if (fileItem.status === 'uploading') {
      loading.value = true;
      return;
    }
    if (fileItem.status === 'done') {
      loading.value = false;
      fileList.value = fileItemList;
      const { response } = fileItem;
      const mediaList = updateMediaList(fileItemList);
      emit('upload', mediaList, response);
    }
    if (fileItem.status === 'error') {
      loading.value = false;
      fileList.value = fileItemList.filter((item) => item.status !== 'error');
      const { response } = fileItem;
      let errmsg = '上传错误！';
      if (response.error?.includes('limited mimeType')) {
        const validFormat = props.accept
          .replace(/image\//g, '')
          .replace(/video\//g, '')
          .replace(/,/g, '/');
        errmsg = `文件类型不支持，请上传 ${validFormat} 格式的文件！`;
      }
      Message.error(errmsg);
    }
  };

  const onExceedLimit = () => {
    if (props.limit > 0) {
      Message.warning(`最多上传 ${props.limit} 张`);
    }
  };

  const beforeUpload = async (file: File) => {
    if (props.limit > 0 && fileList.value.length >= props.limit) {
      Message.warning(`最多上传 ${props.limit} 张`);
      return false;
    }
    const isOutOfLimit = (file.size as number) / 1024 / 1024 > props.maxSize;
    if (isOutOfLimit) {
      Message.error(`文件不能超过${props.maxSize}MB!`);
      return false;
    }
    if (props.action.includes('qiniu')) {
      // 调用七牛上传接口
      const { data: token } = await API.Media.GetToken({
        mimeLimit: props.accept.split(',').join(';'),
      });
      data.value.token = token;
      if (!token) {
        Message.error('上传失败，请重新上传!');
        return false;
      }
    } else {
      // 调用自己服务器的上传接口
      headers.value.Authorization = `Bearer ${getToken()}`;
    }
    return true;
  };

  const onRemoveFile = (index: number) => {
    fileList.value.splice(index, 1);
    updateMediaList(fileList.value);
    emit('remove', index);
  };

  watch(
    () => props.mediaList,
    (mediaList) => {
      fileList.value = [];
      if (!mediaList || mediaList.length === 0) return;
      mediaList.forEach((image) => {
        fileList.value.push({
          uid: image.hash || image.url,
          status: 'done',
          percent: 100,
          response: image,
          url: image.url,
          name: image.name,
        });
      });
    },
    { deep: true, immediate: true }
  );
</script>

<style lang="less" scoped>
  .single-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    color: @color-text-2;
    font-size: 13px;
    text-align: center;
    background-color: @color-fill-2;
    border: 1px dashed @color-text-4;
    border-radius: 2;
  }

  .single-image {
    position: relative;
    cursor: pointer;

    .cover-bg {
      position: absolute;
      top: 0;
      z-index: 1000;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      opacity: 0;
    }

    .cover-bg:hover {
      width: 100%;
      height: 100%;
      opacity: 1;
      transition: all 0.5s;
    }

    .icon-delete {
      display: none;
    }

    &:hover {
      .icon-delete {
        position: absolute;
        right: 6px;
        bottom: 6px;
        display: block;
        color: white;
        border-radius: 100%;
      }
    }
  }
</style>
