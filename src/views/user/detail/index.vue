<script setup lang="ts">
  import useOrderApi from '@/biz/hooks/order/order';
  import useUserApi from '@/biz/hooks/user/user';
  import { getFormatValue } from '@/biz/model-base/decorator/metada';
  import MOrder from '@/biz/model/order/order';
  import { onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import OrderStatusTag from '@/views/order/components/order-status-tag.vue';

  const route = useRoute();
  const router = useRouter();
  const userId = Number(route.params.id || 0);

  const { detail, loading, loadDetail } = useUserApi();
  const {
    pageData: orderPageData,
    queryParams: orderQueryParams,
    loading: orderLoading,
    loadFirstPageData: loadOrderList,
  } = useOrderApi();

  const orderColumns = [
    { title: '订单号', dataIndex: 'orderNo', width: 200 },
    { title: '活动/产品', slotName: 'product', width: 240 },
    { title: '实付', slotName: 'payAmount', width: 90 },
    { title: '状态', slotName: 'status', width: 100 },
    { title: '下单时间', dataIndex: 'createdAt', width: 160 },
    { title: '操作', slotName: 'operation', width: 100 },
  ];

  const basicInfo = [
    { label: '用户 ID', field: 'id' },
    { label: '昵称', field: 'nickName' },
    { label: '手机号', field: 'mobile' },
    { label: '性别', field: 'gender' },
    { label: '状态', field: 'status' },
    { label: '生日', field: 'birthday' },
    { label: '所在地区', field: 'areaLabel' },
    { label: '核销权限', field: 'isStaff' },
    { label: '注册时间', field: 'createdAt' },
    { label: '最近活跃', field: 'lastActiveAt' },
  ];

  const creditInfo = [
    { label: '可用积分', field: 'creditBalance' },
    { label: '累计使用', field: 'creditUsed' },
    { label: '本年获得', field: 'creditEarnedYear' },
  ];

  const applyInfo = [
    { label: '姓名', field: 'applyName' },
    { label: '手机号', field: 'applyMobile' },
    { label: '身份证号', field: 'applyIDNo' },
    { label: '紧急联系人', field: 'applyEmergMobile' },
  ];

  const descLabelStyle = { width: '100px', paddingRight: '12px' };

  const displayField = (field: string) => {
    const value = getFormatValue(detail.value, field);
    if (value === '' || value === null || value === undefined) return '/';
    if (field === 'isStaff') return value ? '是' : '否';
    return value;
  };

  const formatPayAmount = (record: MOrder) => {
    if (record.product?.feeType === 1) return '免费';
    return `¥${Number(record.payAmount || 0).toFixed(2)}`;
  };

  const gotoOrderDetail = (record: MOrder) => {
    router.push({
      name: 'OrderDetail',
      params: { orderNo: record.orderNo },
    });
  };

  onMounted(async () => {
    if (!userId) return;
    await loadDetail(userId);
    orderQueryParams.value.userId = userId;
    orderQueryParams.value.status = 0;
    await loadOrderList();
  });
</script>

<template>
  <div class="content">
    <a-spin :loading="loading.detail" style="width: 100%">
      <a-card title="基础信息" :bordered="false">
        <div class="info-grid">
          <div v-if="detail.avatar" class="info-avatar">
            <a-image :src="detail.avatar" width="72" height="72" fit="cover" />
          </div>
          <a-descriptions
            class="user-desc"
            :column="3"
            size="medium"
            :label-style="descLabelStyle"
          >
            <a-descriptions-item
              v-for="item in basicInfo"
              :key="item.label"
              :label="item.label"
            >
              {{ displayField(item.field) }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </a-card>

      <a-card title="积分信息" :bordered="false" class="wm-t-15">
        <a-descriptions
          class="user-desc"
          :column="3"
          size="medium"
          :label-style="descLabelStyle"
        >
          <a-descriptions-item
            v-for="item in creditInfo"
            :key="item.label"
            :label="item.label"
          >
            {{ displayField(item.field) }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card title="最近报名信息" :bordered="false" class="wm-t-15">
        <a-descriptions
          class="user-desc"
          :column="3"
          size="medium"
          :label-style="descLabelStyle"
        >
          <a-descriptions-item
            v-for="item in applyInfo"
            :key="item.label"
            :label="item.label"
          >
            {{ displayField(item.field) }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card title="订单记录" :bordered="false" class="wm-t-15">
        <h-table
          :loading="orderLoading.page"
          :page-data="orderPageData"
          :columns="orderColumns"
        >
          <template #product="{ record }">
            <div class="product-cell">
              <a-image
                v-if="record.product?.cover"
                :src="record.product.cover"
                width="40"
                height="40"
                fit="cover"
              />
              <span>{{ record.product?.title || '/' }}</span>
            </div>
          </template>
          <template #payAmount="{ record }">
            {{ formatPayAmount(record) }}
          </template>
          <template #status="{ record }">
            <order-status-tag :status="record.status" />
          </template>
          <template #operation="{ record }">
            <a-button size="small" type="text" @click="gotoOrderDetail(record)">
              查看详情
            </a-button>
          </template>
        </h-table>
      </a-card>
    </a-spin>
  </div>
</template>

<style lang="less" scoped>
  .content {
    margin: -1px auto 0;
  }

  .info-grid {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .info-avatar {
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 50%;
  }

  .user-desc {
    flex: 1;
    width: 100%;
    min-width: 0;

    :deep(.arco-descriptions-body),
    :deep(.arco-descriptions-table) {
      width: 100%;
    }

    :deep(.arco-descriptions-table) {
      table-layout: fixed;
    }

    :deep(.arco-descriptions-item-value) {
      word-break: break-all;
    }
  }

  .product-cell {
    display: flex;
    gap: 8px;
    align-items: center;
  }
</style>
