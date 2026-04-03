<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{ modelValue: any }>();
  const emit = defineEmits(['update:modelValue']);
  const value = computed({
    get: () => props.modelValue || '',
    set: (val) => {
      emit('update:modelValue', val);
    },
  });
</script>

<template>
  <a-cascader v-model="value" />
</template>
