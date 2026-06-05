<script setup lang="ts">
  import {
    canCancelAftersale,
    getOrderListRefundActionLabel,
    isOrderRefundable,
    isScheduleCancelAftersale,
    ORDER_STATUS_OPTIONS,
    OrderStatus,
  } from '@/biz/const/order';
  import useOrderApi from '@/biz/hooks/order/order';
  import MOrder from '@/biz/model/order/order';
  import { Modal } from '@arco-design/web-vue';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import openOrderRefund from './components/open-order-refund';
  import OrderStatusTag from './components/order-status-tag.vue';

  const router = useRouter();
  const {
    queryParams,
    pageData,
    loadFirstPageData,
    loadCurrentPageData,
    cancelAftersale,
    submitRefund,
  } = useOrderApi();

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 200 },
    { title: '活动/产品', slotName: 'product', width: 260 },
    { title: '下单用户', slotName: 'user', width: 140 },
    { title: '报名人', slotName: 'member', width: 140 },
    { title: '人数', slotName: 'quantity', width: 70 },
    { title: '实付', slotName: 'payAmount', width: 90 },
    { title: '状态', slotName: 'status', width: 100 },
    { title: '操作', slotName: 'operation', width: 200 },
  ];

  const formatPayAmount = (record: MOrder) => {
    if (record.product?.feeType === 1) return '免费';
    return `¥${Number(record.payAmount || 0).toFixed(2)}`;
  };

  const verifiedCount = (record: MOrder) =>
    (record.verifies || []).filter((item) => item.status === 2).length;

  const gotoDetail = (record: MOrder) => {
    router.push({
      name: 'OrderDetail',
      params: { orderNo: record.orderNo },
    });
  };

  const onReset = () => {
    queryParams.value.orderNo = '';
    queryParams.value.mobile = '';
    queryParams.value.title = '';
    queryParams.value.status = 0;
    loadFirstPageData();
  };

  const onRefund = (record: MOrder) => {
    openOrderRefund({
      order: record,
      submitRefund,
      onSuccess: loadCurrentPageData,
    });
  };

  const onCloseAftersale = (record: MOrder) => {
    const aftersaleOrderNo = record.aftersale?.aftersaleOrderNo;
    if (!aftersaleOrderNo) return;
    Modal.confirm({
      title: '关闭售后',
      content: '关闭后订单状态将恢复，是否继续？',
      onOk: async () => {
        await cancelAftersale(aftersaleOrderNo);
        loadCurrentPageData();
      },
    });
  };

  const showRefundBtn = (record: MOrder) =>
    isOrderRefundable(record.status) &&
    !isScheduleCancelAftersale(record.aftersale);

  const showCloseAftersaleBtn = (record: MOrder) =>
    canCancelAftersale(record.aftersale);

  onMounted(() => {
    loadFirstPageData();
  });
</script>

<template>
  <div class="content">
    <div class="h-search-card">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="queryParams"
            auto-label-width
            label-align="left"
            layout="inline"
            size="small"
          >
            <a-form-item field="orderNo" label="订单号">
              <a-input
                v-model.trim="queryParams.orderNo"
                style="width: 220px"
                placeholder="请输入订单号"
                allow-clear
                @press-enter="loadFirstPageData()"
                @clear="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="mobile" label="手机号">
              <a-input
                v-model.trim="queryParams.mobile"
                style="width: 180px"
                placeholder="用户/报名人"
                allow-clear
                @press-enter="loadFirstPageData()"
                @clear="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="title" label="活动名称">
              <a-input
                v-model.trim="queryParams.title"
                style="width: 200px"
                placeholder="请输入活动名称"
                allow-clear
                @press-enter="loadFirstPageData()"
                @clear="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="status" label="状态">
              <h-select
                v-model="queryParams.status"
                allow-clear
                :empty-value="0"
                style="width: 160px"
                :options="ORDER_STATUS_OPTIONS"
                placeholder="全部状态"
                @change="loadFirstPageData()"
              />
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :flex="'200px'" style="text-align: right">
          <a-space>
            <a-button type="primary" size="small" @click="loadFirstPageData()">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button size="small" @click="onReset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <h-table :page-data="pageData" :columns="columns">
      <template #header>
        <div>订单列表</div>
      </template>
      <template #product="{ record }">
        <div class="product-cell">
          <a-image
            v-if="record.product?.cover"
            :src="record.product.cover"
            width="48"
            height="48"
            fit="cover"
          />
          <div class="product-cell__info">
            <div class="product-cell__title">{{
              record.product?.title || '/'
            }}</div>
            <div v-if="record.product?.startAt" class="product-cell__meta">
              {{ record.product.startAt }}
            </div>
          </div>
        </div>
      </template>
      <template #user="{ record }">
        <div>{{ record.user?.nickName || '/' }}</div>
        <div class="sub-text">{{ record.user?.mobile || '' }}</div>
      </template>
      <template #member="{ record }">
        <template v-if="record.members?.length">
          <div>{{ record.members[0].name }}</div>
          <div class="sub-text">{{ record.members[0].mobile }}</div>
        </template>
        <span v-else>/</span>
      </template>
      <template #quantity="{ record }">
        <span>{{ record.product?.quantity || 0 }}</span>
        <span
          v-if="
            [OrderStatus.PART_VERIFIED, OrderStatus.VERIFIED].includes(
              record.status
            )
          "
          class="sub-text"
        >
          （已核 {{ verifiedCount(record) }}）
        </span>
      </template>
      <template #payAmount="{ record }">
        {{ formatPayAmount(record) }}
      </template>
      <template #status="{ record }">
        <order-status-tag :status="record.status" />
      </template>
      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button
            class="op-btn"
            size="small"
            type="text"
            @click="gotoDetail(record)"
          >
            查看详情
          </a-button>
        </div>
        <div v-if="showRefundBtn(record)" class="h-tb-btn">
          <a-button
            class="op-btn"
            size="small"
            type="text"
            status="warning"
            @click="onRefund(record)"
          >
            {{ getOrderListRefundActionLabel(record) }}
          </a-button>
        </div>
        <div v-if="showCloseAftersaleBtn(record)" class="h-tb-btn">
          <a-button
            class="op-btn"
            size="small"
            type="text"
            @click="onCloseAftersale(record)"
          >
            关闭售后
          </a-button>
        </div>
      </template>
    </h-table>
  </div>
</template>

<style lang="less" scoped>
  .content {
    margin: -1px auto 0;
  }

  .product-cell {
    display: flex;
    gap: 10px;
    align-items: center;

    &__info {
      flex: 1;
      min-width: 0;
    }

    &__title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__meta {
      color: var(--color-text-3);
      font-size: 12px;
    }
  }

  .sub-text {
    color: var(--color-text-3);
    font-size: 12px;
  }

  .op-btn {
    min-width: 4em;
    padding: 0 4px;
    text-align: center;
  }
</style>
