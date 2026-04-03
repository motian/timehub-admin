<script setup lang="ts">
  import '@wangeditor/editor/dist/css/style.css';
  import { onBeforeUnmount, ref, watch, shallowRef, PropType } from 'vue';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

  const props = defineProps({
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
  });
  const emit = defineEmits(['update:modelValue']);

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef();

  // 内容 HTML
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
  const editorConfig = { placeholder: '请输入公告正文...' };

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });

  const handleCreated = (editor: any) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
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
      style="height: 300px; overflow-y: hidden"
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
