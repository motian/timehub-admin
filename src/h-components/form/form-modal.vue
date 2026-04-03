<script setup lang="ts">
  import { Message } from '@arco-design/web-vue';
  import type { FormInstance } from '@arco-design/web-vue';
  import { isDefined, useWindowSize } from '@vueuse/core';
  import { ref, computed, PropType } from 'vue';

  type onBeforeOk = () => void | boolean | Promise<void | boolean>;

  const hFormRef = ref<any>();
  defineExpose({
    getFormRef: () => hFormRef.value?.formRef,
  });

  const props = defineProps({
    width: {
      type: Number as PropType<number>,
      default: 800,
    },
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: 'auto',
    },
    onBeforeOk: {
      type: Function as PropType<onBeforeOk>,
    },
    showReset: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    config: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    modelValue: {
      type: Object as PropType<any>,
      default: () => {
        return {};
      },
    },
    size: {
      type: String as PropType<'small' | 'mini' | 'medium' | 'large'>,
      default: 'mini',
    },
    labelColProps: {
      type: Object,
      default: () => {
        return {
          span: 3,
          offset: 0,
        };
      },
    },
    wrapperColProps: {
      type: Object,
      default: () => {
        return {
          span: 21,
          offset: 0,
        };
      },
    },
    autoLabelWidth: {
      type: Boolean,
      default: true,
    },
    radioMinWidth: {
      type: Number,
      default: 0,
    },
    checkboxMinWidth: {
      type: Number,
      default: 0,
    },
    hideGroupTitle: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits([
    'update:visible',
    'update:modelValue',
    'reset',
    'ok',
  ]);

  const { height: windowHeight } = useWindowSize();
  const loading = ref(false);

  const contentHeight = computed(() => {
    const h = `${props.height}`;
    if (h.endsWith('px')) {
      return h;
    }
    if (h.endsWith('%')) {
      const hNum = Number(h.replace('%', ''));
      return `${(windowHeight.value * hNum) / 100}px`;
    }
    return `${h}px`;
  });

  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  const showModal = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
  });

  async function onOk() {
    const formRef = hFormRef.value.formRef as FormInstance;
    const errors = await formRef.validate();
    if (errors) {
      const key = Object.keys(errors)?.[0];
      Message.warning(errors?.[key]?.message);
      return;
    }
    loading.value = true;
    if (isDefined(props.onBeforeOk)) {
      const success = await props.onBeforeOk();
      if (success !== false) {
        emit('ok');
        showModal.value = false;
      }
    } else {
      emit('ok');
      showModal.value = false;
    }
    loading.value = false;
  }

  function onResetField() {
    const formRef = hFormRef.value.formRef as FormInstance;
    formRef.resetFields();
    emit('reset');
  }
</script>

<template>
  <a-modal
    v-model:visible="showModal"
    :mask-closable="false"
    :width="width"
    :on-before-ok="onBeforeOk"
  >
    <slot name="header"></slot>
    <h-form
      ref="hFormRef"
      v-model="formData"
      :config="config"
      :size="size"
      :style="{ height: contentHeight }"
      :label-col-props="labelColProps"
      :wrapper-col-props="wrapperColProps"
      :auto-label-width="autoLabelWidth"
      :radio-min-width="radioMinWidth"
      :checkbox-min-width="checkboxMinWidth"
      :hide-group-title="hideGroupTitle"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot v-if="data" :name="item" v-bind="data"> </slot>
        <slot v-else :name="item"> </slot>
      </template>
    </h-form>

    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot v-if="data" :name="item" v-bind="data"> </slot>
      <slot v-else :name="item"> </slot>
    </template>
    <template v-if="!Object.keys($slots).includes('footer')" #footer>
      <a-space>
        <a-button @click="showModal = false">取消</a-button>
        <a-button v-if="showReset" @click="onResetField()">重置</a-button>
        <a-button type="primary" :loading="loading" @click="onOk">
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>
