<script setup lang="ts">
  import { isFreeActivityOrder } from '@/biz/const/order';
  import type { FormInstance } from '@arco-design/web-vue';
  import { computed, reactive, ref, watch } from 'vue';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    orderNo: {
      type: String,
      required: true,
    },
    payAmount: {
      type: Number,
      default: 0,
    },
    feeType: {
      type: Number,
      default: 0,
    },
    onSubmit: {
      type: Function as import('vue').PropType<
        (data: {
          orderNo: string;
          refundAmount: number;
          remark: string;
        }) => Promise<void>
      >,
      required: true,
    },
  });

  const emit = defineEmits(['update:visible']);

  const formRef = ref<FormInstance>();
  const form = reactive({
    refundAmount: undefined as number | undefined,
    refundRemark: '',
  });

  const isFree = computed(() =>
    isFreeActivityOrder({ product: { feeType: props.feeType } })
  );

  const modalTitle = computed(() => (isFree.value ? '取消报名' : '提交退款'));

  const payAmountLabel = computed(() => {
    if (isFree.value) return '免费';
    return `¥${props.payAmount.toFixed(2)}`;
  });

  const refundAmountRules = [
    { required: true, message: '请输入退款金额' },
    {
      validator: (
        value: number | undefined,
        callback: (msg?: string) => void
      ) => {
        if (value == null || Number(value) <= 0) {
          callback('请输入退款金额');
        } else {
          callback();
        }
      },
    },
  ];

  const refundRemarkRules = computed(() => [
    {
      required: true,
      message: isFree.value ? '请填写取消原因' : '请填写退款备注',
    },
    {
      validator: (
        value: string | undefined,
        callback: (msg?: string) => void
      ) => {
        if (!String(value ?? '').trim()) {
          callback(isFree.value ? '请填写取消原因' : '请填写退款备注');
        } else {
          callback();
        }
      },
    },
  ]);

  const remarkPlaceholder = computed(() =>
    isFree.value ? '请填写取消原因或操作说明' : '请填写退款原因或操作说明'
  );

  const showModal = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
  });

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        form.refundAmount = props.payAmount > 0 ? props.payAmount : undefined;
        form.refundRemark = '';
        formRef.value?.clearValidate();
      }
    }
  );

  const onBeforeOk = async () => {
    const errors = await formRef.value?.validate();
    if (errors) return false;
    await props.onSubmit({
      orderNo: props.orderNo,
      refundAmount: isFree.value ? 0 : Number(form.refundAmount),
      remark: form.refundRemark.trim(),
    });
    return true;
  };
</script>

<template>
  <a-modal
    v-model:visible="showModal"
    :title="modalTitle"
    :mask-closable="false"
    :on-before-ok="onBeforeOk"
  >
    <a-alert v-if="isFree" type="warning" style="margin-bottom: 16px">
      仅支持整单取消，不支持取消部分报名。
    </a-alert>
    <a-form ref="formRef" :model="form" layout="vertical">
      <a-form-item label="订单号">
        <a-input :model-value="orderNo" disabled />
      </a-form-item>
      <a-form-item :label="isFree ? '活动费用' : '实付金额'">
        <a-input :model-value="payAmountLabel" disabled />
      </a-form-item>
      <a-form-item
        v-if="!isFree"
        label="退款金额"
        field="refundAmount"
        required
        :rules="refundAmountRules"
      >
        <a-input-number
          v-model="form.refundAmount"
          :min="0.01"
          :max="payAmount"
          :precision="2"
          placeholder="请输入退款金额"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item
        :label="isFree ? '取消原因' : '备注'"
        field="refundRemark"
        required
        :rules="refundRemarkRules"
      >
        <a-textarea
          v-model="form.refundRemark"
          :placeholder="remarkPlaceholder"
          :auto-size="{ minRows: 2, maxRows: 4 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
