<script setup lang="ts">
  import { ORDER_STATUS_OPTIONS } from '@/biz/const/order';
  import { computed, PropType } from 'vue';

  const props = defineProps({
    status: {
      type: Number as PropType<number>,
      required: true,
    },
  });

  const statusMeta = computed(() => {
    const item = ORDER_STATUS_OPTIONS.find((opt) => opt.value === props.status);
    return item || { label: String(props.status), value: props.status };
  });

  const tagColor = computed(() => {
    switch (props.status) {
      case 11:
        return 'orangered';
      case 12:
        return 'gray';
      case 21:
        return 'arcoblue';
      case 31:
      case 32:
        return 'green';
      case 51:
        return 'orange';
      case 52:
        return 'red';
      default:
        return 'gray';
    }
  });
</script>

<template>
  <a-tag :color="tagColor" size="small">{{ statusMeta.label }}</a-tag>
</template>
