<script setup lang="ts">
  import { isUndefined } from 'lodash-es';
  import { computed, PropType } from 'vue';

  const props = defineProps({
    arcoEmpty: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    hideButton: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    modelValue: {
      type: Number as PropType<number> | undefined,
      default: undefined,
    },
  });
  const emit = defineEmits(['update:modelValue']);
  const inputValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  function formatter(val: string) {
    if (!props.arcoEmpty) {
      return val === '-1' ? '' : val;
    }
    return val;
  }

  // 1. @change 单独用偶现弹窗第一次修改不触发事件的 bug, 增加 @input 实时反馈弥补
  // 2. @input 单独用在清空数据后，会默认置为 undefined，通过 @change 支持空值默认 -1
  function onChange(val: number | undefined) {
    if (!props.arcoEmpty) {
      inputValue.value = isUndefined(val) ? -1 : val;
    } else {
      inputValue.value = val;
    }
  }
</script>

<template>
  <a-input-number
    v-model="inputValue"
    :hide-button="hideButton"
    :formatter="formatter"
    @input="onChange"
    @change="onChange"
  >
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot v-if="data" :name="item" v-bind="data"> </slot>
      <slot v-else :name="item"> </slot>
    </template>
  </a-input-number>
</template>
