<script setup lang="ts">
  import {
    AftersaleType,
    AFTERSALE_REFUND_STATUS_OPTIONS,
    canCancelAftersale,
    isFreeActivityOrder,
    canSubmitRefund,
    ORDER_VERIFY_STATUS_OPTIONS,
  } from '@/biz/const/order';
  import useOrderApi from '@/biz/hooks/order/order';
  import { Modal } from '@arco-design/web-vue';
  import { computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import openOrderRefund from '../components/open-order-refund';
  import OrderStatusTag from '../components/order-status-tag.vue';

  const route = useRoute();
  const router = useRouter();
  const orderNo = String(route.params.orderNo || '');
  const { detail, loadOrderDetail, submitRefund, cancelAftersale } =
    useOrderApi();

  const member = computed(() => detail.value.members?.[0]);
  const verifiedCount = computed(
    () => detail.value.verifies?.filter((item) => item.status === 2).length || 0
  );

  const verifyColumns = [
    { title: '序号', dataIndex: 'seq', width: 60 },
    { title: '核销码', dataIndex: 'verifyCode', width: 200 },
    { title: '状态', slotName: 'verifyStatus', width: 100 },
    { title: '积分', dataIndex: 'credit', width: 80 },
    { title: '核销时间', dataIndex: 'verifiedAt', width: 160 },
  ];

  const verifyStatusLabel = (status: number) =>
    ORDER_VERIFY_STATUS_OPTIONS.find((item) => item.value === status)?.label ||
    String(status);

  const formatPayAmount = () => {
    if (detail.value.product?.feeType === 1) return '免费';
    return `¥${Number(detail.value.payAmount || 0).toFixed(2)}`;
  };

  const aftersaleTypeLabel = (type: number) => {
    const free = isFreeActivityOrder(detail.value);
    const map: Record<number, string> = {
      [AftersaleType.USER_CANCEL]: '用户取消报名',
      [AftersaleType.ADMIN_REFUND]: free ? '后台取消报名' : '后台退款',
      [AftersaleType.SCHEDULE_CANCEL]: free
        ? '活动取消（自动取消报名）'
        : '活动取消（自动退款）',
    };
    return map[type] || String(type);
  };

  const openRefundModal = () => {
    openOrderRefund({
      order: detail.value,
      submitRefund,
      onSuccess: () => loadOrderDetail(orderNo),
    });
  };

  const onCloseAftersale = () => {
    const aftersaleOrderNo = detail.value.aftersale?.aftersaleOrderNo;
    if (!aftersaleOrderNo) return;
    Modal.confirm({
      title: '关闭售后',
      content: '关闭后订单状态将恢复，是否继续？',
      onOk: async () => {
        await cancelAftersale(aftersaleOrderNo);
        await loadOrderDetail(orderNo);
      },
    });
  };

  onMounted(async () => {
    if (orderNo) {
      await loadOrderDetail(orderNo);
    }
  });
</script>

<template>
  <div class="container">
    <a-card title="订单信息" class="section-card">
      <template #extra>
        <a-space>
          <a-button
            v-if="canSubmitRefund(detail)"
            type="primary"
            status="warning"
            size="small"
            @click="openRefundModal"
          >
            {{ isFreeActivityOrder(detail) ? '取消报名' : '提交退款' }}
          </a-button>
          <a-button
            v-if="canCancelAftersale(detail.aftersale)"
            size="small"
            @click="onCloseAftersale"
          >
            关闭售后
          </a-button>
        </a-space>
      </template>
      <a-descriptions :column="2" bordered size="medium">
        <a-descriptions-item label="订单号">
          {{ detail.orderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="订单状态">
          <order-status-tag :status="detail.status" />
        </a-descriptions-item>
        <a-descriptions-item label="下单时间">
          {{ detail.createdAt || '/' }}
        </a-descriptions-item>
        <a-descriptions-item label="实付金额">
          {{ formatPayAmount() }}
        </a-descriptions-item>
        <a-descriptions-item label="支付时间">
          {{ detail.paidAt || '/' }}
        </a-descriptions-item>
        <a-descriptions-item label="支付流水">
          {{ detail.transactionId || '/' }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="detail.cancelReason"
          label="取消原因"
          :span="2"
        >
          {{ detail.cancelReason }}
        </a-descriptions-item>
        <a-descriptions-item v-if="detail.remark" label="备注" :span="2">
          {{ detail.remark }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="活动信息" class="section-card">
      <div class="product-block">
        <a-image
          v-if="detail.product?.cover"
          :src="detail.product.cover"
          width="80"
          height="80"
          fit="cover"
        />
        <a-descriptions :column="2" class="product-desc">
          <a-descriptions-item label="活动名称">
            {{ detail.product?.title || '/' }}
          </a-descriptions-item>
          <a-descriptions-item label="活动时间">
            {{ detail.product?.startAt || '/' }}
          </a-descriptions-item>
          <a-descriptions-item label="活动地点">
            {{
              detail.product?.shortAddress || detail.product?.fullAddress || '/'
            }}
          </a-descriptions-item>
          <a-descriptions-item label="报名人数">
            {{ detail.product?.quantity || 0 }}（已核销 {{ verifiedCount }}）
          </a-descriptions-item>
          <a-descriptions-item label="单价">
            {{
              detail.product?.feeType === 1
                ? '免费'
                : `¥${Number(detail.product?.unitPrice || 0).toFixed(2)}`
            }}
          </a-descriptions-item>
          <a-descriptions-item label="商品小计">
            ¥{{ Number(detail.product?.totalAmount || 0).toFixed(2) }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>

    <a-card title="下单用户" class="section-card">
      <a-descriptions :column="2" bordered size="medium">
        <a-descriptions-item label="用户 ID">
          {{ detail.user?.id || detail.userId }}
        </a-descriptions-item>
        <a-descriptions-item label="昵称">
          {{ detail.user?.nickName || '/' }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号">
          {{ detail.user?.mobile || '/' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card v-if="member" title="报名人" class="section-card">
      <a-descriptions :column="2" bordered size="medium">
        <a-descriptions-item label="姓名">
          {{ member.name }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号">
          {{ member.mobile }}
        </a-descriptions-item>
        <a-descriptions-item label="身份证号">
          {{ member.idNo }}
        </a-descriptions-item>
        <a-descriptions-item label="紧急联系人">
          {{ member.emergMobile }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card
      v-if="detail.verifies?.length"
      title="核销记录"
      class="section-card"
    >
      <a-table
        :data="detail.verifies"
        :columns="verifyColumns"
        :pagination="false"
        size="small"
      >
        <template #verifyStatus="{ record }">
          {{ verifyStatusLabel(record.status) }}
        </template>
      </a-table>
    </a-card>

    <a-card
      v-if="detail.aftersale?.aftersaleOrderNo"
      title="售后信息"
      class="section-card"
    >
      <a-descriptions :column="2" bordered size="medium">
        <a-descriptions-item label="售后单号">
          {{ detail.aftersale.aftersaleOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="售后类型">
          {{ aftersaleTypeLabel(detail.aftersale.type) }}
        </a-descriptions-item>
        <a-descriptions-item label="退款金额">
          ¥{{ Number(detail.aftersale.refundAmount || 0).toFixed(2) }}
        </a-descriptions-item>
        <a-descriptions-item label="退款状态">
          {{
            AFTERSALE_REFUND_STATUS_OPTIONS.find(
              (item) => item.value === detail.aftersale?.refundStatus
            )?.label || detail.aftersale?.refundStatus
          }}
        </a-descriptions-item>
        <a-descriptions-item label="申请时间">
          {{ detail.aftersale.createdAt || '/' }}
        </a-descriptions-item>
        <a-descriptions-item label="退款时间">
          {{ detail.aftersale.refundAt || '/' }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="detail.aftersale.remark"
          label="备注"
          :span="2"
        >
          {{ detail.aftersale.remark }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding-bottom: 40px;
  }

  .section-card {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .product-block {
    display: flex;
    gap: 16px;
  }

  .product-desc {
    flex: 1;
  }
</style>
