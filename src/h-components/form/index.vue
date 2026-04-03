<script lang="ts" setup>
  import { ref, reactive, watchEffect, PropType } from 'vue';
  import type { FormInstance } from '@arco-design/web-vue';
  import { get as getObjVal, set as setObjVal, isFunction } from 'lodash-es';
  import FlexGroupItem from './components/flex-group-item.vue';

  const formRef = ref<FormInstance>();

  defineExpose({
    formRef,
    getFormRef: () => formRef.value,
  });

  const props = defineProps({
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
  const emit = defineEmits(['update:modelValue']);

  const form = ref<Record<string, any>>(props.modelValue);
  const formData = reactive(
    new Proxy(form, {
      get: (target, prop) => {
        return getObjVal(target.value, prop);
      },
      set: (target, prop, value) => {
        setObjVal(target.value, prop, value);
        emit('update:modelValue', target.value);
        return true;
      },
    })
  ) as Record<string, any>;
  const expandedKeys = ref<boolean[]>([]);

  function onAddInput(name: string) {
    formData[name]?.push('');
  }

  function onRemoveInput(name: string, index: number) {
    formData[name]?.splice(index, 1);
  }

  watchEffect(() => {
    form.value = props.modelValue;
    if (!expandedKeys.value.length) {
      props.config.forEach((item) => {
        const expand = !item.expandable;
        expandedKeys.value.push(expand);
      });
    }
  });
</script>

<template>
  <div class="form-layout">
    <a-form
      ref="formRef"
      layout="horizontal"
      :model="modelValue"
      :size="size"
      :label-col-props="labelColProps"
      :wrapper-col-props="wrapperColProps"
      :auto-label-width="autoLabelWidth"
    >
      <template
        v-for="(configItem, index) in config"
        :key="`${index}-${configItem.title}`"
      >
        <div v-if="!hideGroupTitle" class="h-flex-jsb">
          <div class="form-group-title">{{ configItem.title }}</div>
          <div
            v-if="configItem.expandable"
            class="form-group-expand h-pointer"
            @click="expandedKeys[index] = !expandedKeys[index]"
          >
            <span v-if="!expandedKeys[index]">点击展开<icon-right /></span>
            <span v-else>点击收起<icon-down /></span>
          </div>
        </div>
        <div
          v-for="(formItem, formIndex) in configItem.children"
          v-show="expandedKeys[index]"
          :key="`${formIndex}-${formItem.name || formItem.slotName}`"
          class="form-content"
        >
          <slot
            v-if="formItem.slotName != ''"
            :form-item="formItem"
            :name="formItem.slotName"
          >
          </slot>
          <template v-if="formItem.type === 'input-range'">
            <a-form-item :label="formItem.label">
              <div class="h-flex-jsb">
                <a-form-item
                  v-for="(subFormItem, subIndex) in formItem.data"
                  :key="subIndex"
                  hide-label
                  no-style
                  :required="subFormItem.required"
                  :field="subFormItem.name"
                  :rules="subFormItem.rules"
                >
                  <h-input-number
                    v-model="formData[subFormItem.name]"
                    v-bind="subFormItem.bindAttrs"
                  >
                    <template v-if="subFormItem.bindAttrs?.append" #append>
                      {{ subFormItem.bindAttrs?.append }}
                    </template>
                  </h-input-number>
                  <span
                    v-if="subIndex < formItem.data.length - 1"
                    class="wm-lr-5"
                  >
                    -
                  </span>
                </a-form-item>
              </div>
            </a-form-item>
          </template>
          <template v-else-if="formItem.type === 'input-array'">
            <a-row
              v-for="(item, itemIndex) in formData[formItem.name]"
              :key="itemIndex"
              :gutter="20"
            >
              <a-col :flex="1">
                <a-form-item
                  :label="formItem.label + (itemIndex > 0 ? itemIndex + 1 : '')"
                  :field="`${formItem.name}.${itemIndex}`"
                  :rules="formItem.rules"
                >
                  <a-input
                    v-model.trim="formData[formItem.name][itemIndex]"
                    v-bind="formItem.bindAttrs"
                  />
                  <a-button
                    v-if="itemIndex > 0"
                    class="wm-l-10"
                    type="dashed"
                    status="danger"
                    @click="onRemoveInput(formItem.name, itemIndex)"
                  >
                    删除
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item
              v-if="
                !formItem.limit ||
                formData[formItem.name]?.length < formItem.limit
              "
            >
              <a-button type="text" @click="onAddInput(formItem.name)">
                增加{{ formItem.label }}
              </a-button>
            </a-form-item>
          </template>
          <template v-else-if="formItem.type === 'input-group'">
            <a-row :gutter="20">
              <a-col
                v-for="(subFormItem, subIndex) in formItem.data"
                :key="subIndex"
                :flex="1"
              >
                <a-form-item
                  :hide-label="!subFormItem.label"
                  :label="subFormItem.label"
                  :required="subFormItem.required"
                  :field="subFormItem.name"
                  :rules="subFormItem.rules"
                >
                  <a-input
                    v-if="subFormItem.type === 'input'"
                    v-model.trim="formData[subFormItem.name]"
                    v-bind="subFormItem.bindAttrs"
                  >
                    <template v-if="subFormItem.bindAttrs?.append" #append>
                      {{ subFormItem.bindAttrs?.append }}
                    </template>
                  </a-input>
                  <h-input-number
                    v-if="subFormItem.type === 'input-number'"
                    v-model="formData[subFormItem.name]"
                    v-bind="subFormItem.bindAttrs"
                  >
                    <template v-if="subFormItem.bindAttrs?.append" #append>
                      {{ subFormItem.bindAttrs?.append }}
                    </template>
                  </h-input-number>
                  <span v-if="subFormItem.type === 'text'">
                    {{
                      isFunction(subFormItem.bindAttrs?.value)
                        ? subFormItem.bindAttrs?.value(formData)
                        : subFormItem.bindAttrs?.value
                    }}
                  </span>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <template v-else-if="formItem.type === 'flex-group'">
            <a-row :gutter="20">
              <a-col
                v-for="(subFormItem, subIndex) in formItem.data"
                :key="subIndex"
                :flex="subFormItem.flex"
              >
                <slot
                  v-if="subFormItem.slotName !== ''"
                  :form-item="subFormItem"
                  :name="subFormItem.slotName"
                >
                </slot>
                <flex-group-item
                  v-if="!subFormItem.slotName"
                  v-model="formData[subFormItem.name]"
                  :form-data="formData"
                  :form-item="subFormItem"
                />
              </a-col>
            </a-row>
          </template>
          <template v-else-if="formItem.type">
            <flex-group-item
              v-model="formData[formItem.name]"
              :form-data="formData"
              :form-item="formItem"
              :radio-min-width="radioMinWidth"
              :checkbox-min-width="checkboxMinWidth"
            />
          </template>
        </div>
      </template>
    </a-form>
  </div>
</template>

<style scoped lang="less">
  .form-layout {
    margin: -24px -20px;
    padding: 20px 35px 20px 20px;
    overflow-y: auto; // 不支持 overlay 会使用 auto
    overflow-y: overlay;

    .form-group-title {
      margin-bottom: 15px;
      font-weight: bold;
      font-size: 15px;
    }

    .form-group-expand {
      color: @color-text-3;
    }

    .form-content {
      margin-left: 15px;
    }
  }
</style>
