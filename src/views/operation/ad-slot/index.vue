<script setup lang="ts">
  import {
    AD_SLOT_REDIRECT_TYPE_OPTIONS,
    AdSlotType,
  } from '@/biz/const/ad-slot';
  import useAdSlotApi from '@/biz/hooks/operation/ad-slot';
  import MAdSlot from '@/biz/model/operation/ad-slot';
  import { Modal } from '@arco-design/web-vue';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const {
    queryParams,
    pageData,
    loadFirstPageData,
    loadCurrentPageData,
    deleteData,
  } = useAdSlotApi();

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '封面', slotName: 'cover', width: 100 },
    { title: '标题', dataIndex: 'title', width: 180 },
    { title: '跳转类型', slotName: 'redirectType', width: 100 },
    { title: '操作', slotName: 'operation', width: 120 },
  ];

  const gotoEdit = (record: MAdSlot | null = null) => {
    router.push({
      name: 'AdSlotEditor',
      query: {
        id: String(record?.id || 0),
        locale: record?.id ? '编辑图片位' : '添加图片位',
      },
    });
  };

  const onDelete = (record: MAdSlot) => {
    Modal.confirm({
      title: '删除图片位',
      content: `确定删除「${record.title}」？删除后不可恢复`,
      okButtonProps: { status: 'danger' },
      onOk: async () => {
        await deleteData(record.id);
        loadCurrentPageData();
      },
    });
  };

  const onReset = () => {
    queryParams.value.title = '';
    loadFirstPageData();
  };

  onMounted(() => {
    queryParams.value.type = AdSlotType.IMAGE;
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
            <a-form-item field="title" label="关键词">
              <a-input
                v-model.trim="queryParams.title"
                style="width: 300px"
                placeholder="请输入标题"
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
        <div>首页图片位列表</div>
        <a-button type="primary" size="small" @click="gotoEdit()">
          添加图片位
        </a-button>
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
      <template #redirectType="{ record }">
        {{
          AD_SLOT_REDIRECT_TYPE_OPTIONS.find(
            (item) => item.value === record.redirectType
          )?.label || record.redirectType
        }}
      </template>
      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button size="small" type="text" @click="gotoEdit(record)">
            编辑
          </a-button>
        </div>
        <div class="h-tb-btn">
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
