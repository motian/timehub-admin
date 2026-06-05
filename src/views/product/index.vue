<script setup lang="ts">
  import {
    canCancelActivity,
    isActivityProduct,
    PRODUCT_STATUS_OPTIONS,
    PRODUCT_TYPE_OPTIONS,
    ProductStatus,
    ProductType,
  } from '@/biz/const/product';
  import useProductApi from '@/biz/hooks/product/product';
  import MProduct from '@/biz/model/product/product';
  import { Modal } from '@arco-design/web-vue';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const {
    queryParams,
    pageData,
    updateStatus,
    cancelActivity,
    loadFirstPageData,
    loadCurrentPageData,
    deleteData,
  } = useProductApi();

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '封面', slotName: 'cover', width: 100 },
    { title: '名称', dataIndex: 'title', width: 180 },
    { title: '类型', slotName: 'type', width: 90 },
    { title: '活动时间', dataIndex: 'startAt', width: 160 },
    { title: '价格', slotName: 'salePrice', width: 90 },
    { title: '名额/库存', slotName: 'quota', width: 100 },
    { title: '状态', slotName: 'status', width: 90 },
    { title: '操作', slotName: 'operation', width: 280 },
  ];

  const formatPrice = (record: MProduct) => {
    if (record.feeType === 1) return '免费';
    return `¥${Number(record.salePrice).toFixed(2)}`;
  };

  const formatQuota = (record: MProduct) => {
    if (record.type === ProductType.CREDIT) {
      return record.stock > 0 ? `${record.stock}` : '/';
    }
    if (record.memberLimit > 0) {
      return `${record.memberLimit} 人`;
    }
    return '不限';
  };

  const gotoEdit = (record: MProduct | null = null) => {
    router.push({
      name: 'ProductEditor',
      query: {
        id: String(record?.id || 0),
        locale: record?.id ? '编辑产品' : '添加产品',
      },
    });
  };

  const gotoApplyList = (record: MProduct) => {
    router.push({
      name: 'OrderList',
      query: {
        productId: String(record.id),
        title: record.title,
        applyOnly: '1',
      },
    });
  };

  const onDelete = (product: MProduct) => {
    Modal.confirm({
      title: '删除产品',
      content: `确定删除「${product.title}」？删除后不可恢复`,
      okButtonProps: { status: 'danger' },
      onOk: async () => {
        await deleteData(product.id);
        loadCurrentPageData();
      },
    });
  };

  const onUpdateStatus = (product: MProduct) => {
    const action = product.status === ProductStatus.ONLINE ? '下架' : '上架';
    Modal.confirm({
      title: `${action}产品`,
      content: `确定${action}「${product.title}」吗？`,
      okButtonProps: {
        status: product.status === ProductStatus.ONLINE ? 'danger' : 'normal',
      },
      onOk: async () => {
        await updateStatus(product);
        loadCurrentPageData();
      },
    });
  };

  const onCancelActivity = (product: MProduct) => {
    Modal.confirm({
      title: '取消活动',
      content: `确定取消活动「${product.title}」？未开始的活动将下架并触发关联订单退款流程。`,
      okButtonProps: { status: 'danger' },
      onOk: async () => {
        await cancelActivity(product);
        loadCurrentPageData();
      },
    });
  };

  const onReset = () => {
    queryParams.value.status = 0;
    queryParams.value.type = 0;
    queryParams.value.title = '';
    loadFirstPageData();
  };

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
            <a-form-item field="type" label="类型">
              <h-select
                v-model="queryParams.type"
                allow-clear
                :empty-value="0"
                style="width: 160px"
                :options="PRODUCT_TYPE_OPTIONS"
                placeholder="全部类型"
                @change="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="status" label="状态">
              <h-select
                v-model="queryParams.status"
                allow-clear
                :empty-value="0"
                style="width: 160px"
                :options="PRODUCT_STATUS_OPTIONS"
                placeholder="全部状态"
                @change="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="title" label="关键词">
              <a-input
                v-model.trim="queryParams.title"
                style="width: 300px"
                search-button
                placeholder="请输入产品名称"
                allow-clear
                @press-enter="loadFirstPageData()"
                @clear="loadFirstPageData()"
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
        <div>产品列表</div>
        <a-button type="primary" size="small" @click="gotoEdit()">
          添加产品
        </a-button>
      </template>
      <template #type="{ record }">
        {{
          PRODUCT_TYPE_OPTIONS.find((item) => item.value === record.type)
            ?.label || record.type
        }}
      </template>
      <template #cover="{ record }">
        <a-image
          v-if="record.cover"
          :src="record.cover"
          width="100"
          height="56"
        />
        <span v-else>/</span>
      </template>
      <template #salePrice="{ record }">
        {{ formatPrice(record) }}
      </template>
      <template #quota="{ record }">
        {{ formatQuota(record) }}
      </template>
      <template #status="{ record }">
        <a-tag
          v-if="record.status === ProductStatus.ONLINE"
          color="#168cff"
          bordered
        >
          上架中
        </a-tag>
        <a-tag v-else color="#86909c" bordered> 已下架 </a-tag>
      </template>
      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button size="small" type="text" @click="gotoEdit(record)">
            编辑
          </a-button>
          <template v-if="isActivityProduct(record.type)">
            <a-divider direction="vertical" :margin="0" />
            <a-button size="small" type="text" @click="gotoApplyList(record)">
              报名列表
            </a-button>
          </template>
        </div>
        <div class="h-tb-btn">
          <a-button
            size="small"
            type="text"
            :status="
              record.status === ProductStatus.ONLINE ? 'danger' : 'normal'
            "
            @click="onUpdateStatus(record)"
          >
            {{ record.status === ProductStatus.ONLINE ? '下架' : '上架' }}
          </a-button>
          <a-divider direction="vertical" :margin="0" />
          <a-button
            v-if="isActivityProduct(record.type)"
            size="small"
            type="text"
            status="danger"
            :disabled="!canCancelActivity(record)"
            @click="onCancelActivity(record)"
          >
            取消活动
          </a-button>
          <a-divider
            v-if="isActivityProduct(record.type)"
            direction="vertical"
            :margin="0"
          />
          <a-button
            size="small"
            type="text"
            status="danger"
            @click="onDelete(record)"
          >
            删除
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
</style>
