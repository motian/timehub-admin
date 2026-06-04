<script setup lang="ts">
  import { isFunction } from 'lodash-es';
  import { PropType, computed } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Object as PropType<any>,
      required: true,
    },
    formData: {
      type: Object as PropType<any>,
      required: true,
    },
    formItem: {
      type: Object as PropType<any>,
      required: true,
    },
    radioMinWidth: {
      type: Number,
      default: 0,
    },
    checkboxMinWidth: {
      type: Number,
      default: 0,
    },
  });
  const emit = defineEmits(['update:modelValue']);

  const formItemData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  const radiominwidth = computed(() => {
    return props.radioMinWidth;
  });

  const checkboxminwidth = computed(() => {
    return props.checkboxMinWidth;
  });

  const formClass = computed(() => {
    if (props.formItem.type === 'radio-group') {
      return ['radio-group'];
    }
    if (props.formItem.type === 'checkbox-group') {
      return ['checkbox-group'];
    }
    return [];
  });

  const formItemAttrs = computed(() => {
    return props.formItem.bindAttrs ?? {};
  });

  const formItemEvents = computed(() => {
    return props.formItem.bindEvents ?? {};
  });

  const formItemVIf = computed(() => {
    return isFunction(props.formItem.vIf)
      ? props.formItem.vIf(props.formData)
      : true;
  });
</script>

<template>
  <a-form-item
    v-if="formItemVIf"
    :class="formClass"
    :hide-label="!formItem.label"
    :label="formItem.label"
    :required="formItem.required"
    :field="formItem.name"
    :rules="formItem.rules"
  >
    <a-radio-group
      v-if="formItem.type === 'radio-group'"
      v-model="formItemData"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    >
      <a-radio
        v-for="(radio, radioIndex) in formItem.data"
        :key="radioIndex"
        :value="radio.value"
      >
        {{ radio.label }}
      </a-radio>
    </a-radio-group>
    <a-checkbox-group
      v-if="formItem.type === 'checkbox-group'"
      v-model="formItemData"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
    <span v-if="formItem.type === 'text'" :style="formItem.bindAttrs.style">
      {{
        isFunction(formItemAttrs.value)
          ? formItemAttrs.value(formData)
          : formItemAttrs.value
      }}
    </span>
    <a-textarea
      v-if="formItem.type === 'textarea'"
      v-model="formItemData"
      :auto-size="{ minRows: 3 }"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
    <a-input
      v-if="formItem.type === 'input'"
      v-model.trim="formItemData"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    >
      <template v-if="formItemAttrs.append" #append>
        {{ formItemAttrs.append }}
      </template>
    </a-input>
    <a-input-tag
      v-if="formItem.type === 'input-tag'"
      v-model="formItemData"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
    <h-input-number
      v-if="formItem.type === 'input-number'"
      v-model="formItemData"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    >
      <template v-if="formItemAttrs.append" #append>
        {{ formItemAttrs.append }}
      </template>
    </h-input-number>
    <h-select
      v-if="formItem.type === 'select'"
      v-model="formItemData"
      placeholder="请选择"
      allow-clear
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
    <a-date-picker
      v-if="formItem.type === 'date-picker'"
      v-model="formItemData"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
    <a-time-picker
      v-if="formItem.type === 'time-picker'"
      v-model="formItemData"
      allow-clear
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
    <a-time-picker
      v-if="formItem.type === 'time-range-picker'"
      v-model="formItemData"
      type="time-range"
      allow-clear
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
    <a-month-picker
      v-if="formItem.type === 'month-picker'"
      v-model="formItemData"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
    <a-date-picker
      v-if="formItem.type === 'year-picker'"
      v-model="formItemData"
      format="YYYY"
      value-format="YYYY"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
    <a-range-picker
      v-if="formItem.type === 'range-picker'"
      v-model="formItemData"
      v-bind="formItemAttrs"
      v-on="formItemEvents"
    />
  </a-form-item>
</template>

<style lang="less" scoped>
  .checkbox-group {
    :deep(.arco-checkbox) {
      min-width: calc(v-bind(checkboxminwidth) * 1px);

      &-label {
        font-size: 13px;
      }
    }
  }

  .radio-group {
    :deep(.arco-radio) {
      min-width: calc(v-bind(radiominwidth) * 1px);

      &-label {
        font-size: 13px;
      }
    }
  }
</style>
