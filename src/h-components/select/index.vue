<script setup lang="ts">
  import { isUndefined } from 'lodash-es';
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<{ modelValue: any; emptyValue?: string | number }>(),
    {
      emptyValue: '',
    }
  );

  const emit = defineEmits(['update:modelValue', 'clear']);

  const selectedValue = computed({
    get: () => {
      if (
        isUndefined(props.modelValue) ||
        props.modelValue === props.emptyValue
      ) {
        // 未定义或为空状态值
        return '';
      }
      return props.modelValue;
    },
    set: (val) => {
      // a-select 清空时传入的是空字符串，转换为 emptyValue
      if (isUndefined(val) || val === '') {
        emit('update:modelValue', props.emptyValue);
      } else {
        emit('update:modelValue', val);
      }
    },
  });

  const onClearSelect = () => {
    selectedValue.value = props.emptyValue;
    emit('clear');
  };
</script>

<template>
  <a-select v-model="selectedValue" @clear="onClearSelect" />
</template>
