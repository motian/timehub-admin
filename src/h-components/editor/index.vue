<script setup lang="ts">
  import '@wangeditor/editor/dist/css/style.css';
  import { API } from '@/api';
  import useImageFormat from '@/biz/hooks/common/image-format';
  import { Message } from '@arco-design/web-vue';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import axios from 'axios';
  import { onBeforeUnmount, PropType, ref, shallowRef, watch } from 'vue';

  type InsertFnType = (url: string, alt: string, href: string) => void;

  const props = defineProps({
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
    height: {
      type: Number as PropType<number>,
      default: 420,
    },
  });
  const emit = defineEmits(['update:modelValue']);
  const { autoFormat } = useImageFormat();

  const editorRef = shallowRef();
  const valueHtml = ref('');
  const toolbarConfig = {
    toolbarKeys: [
      'redo',
      'undo',
      'bold',
      'color',
      'bgColor',
      'clearStyle',
      '|',
      'fontSize',
      'uploadImage',
      'emotion',
      'blockquote',
      'headerSelect',
      'divider',
    ],
  };

  const editorConfig = {
    placeholder: '请输入正文...',
    MENU_CONF: {} as Record<string, unknown>,
  };

  editorConfig.MENU_CONF.uploadImage = {
    customUpload: async (file: File, insertFn: InsertFnType) => {
      try {
        const { data: token } = await API.Media.GetToken({
          mimeLimit: 'image/jpg;image/jpeg;image/png;image/gif;image/webp',
        });
        if (!token) {
          Message.error('上传失败，请重新上传');
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);
        const res = await axios
          .create({ withCredentials: false })
          .post(`https://${window.uploadDomain}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        if (!res.data?.url) {
          Message.error('上传失败，请重新上传');
          return;
        }
        insertFn(autoFormat(res.data.url, 1200), '', '');
      } catch {
        Message.error('上传失败，请重新上传');
      }
    },
  };

  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });

  const handleCreated = (editor: unknown) => {
    editorRef.value = editor;
  };

  watch(
    () => props.modelValue,
    () => {
      valueHtml.value = props.modelValue;
    },
    { immediate: true }
  );

  watch(
    () => valueHtml.value,
    () => {
      emit('update:modelValue', valueHtml.value);
    }
  );
</script>

<template>
  <div class="editor">
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :default-config="toolbarConfig"
      mode="simple"
    />
    <Editor
      v-model="valueHtml"
      :style="{ height: `${props.height}px`, overflowY: 'hidden' }"
      :default-config="editorConfig"
      mode="simple"
      @on-created="handleCreated"
    />
  </div>
</template>

<style lang="less" scoped>
  .editor {
    width: 100%;
    border: solid 1px #eee;

    &-toolbar {
      border-bottom: 1px solid #eee;
    }
  }
</style>
