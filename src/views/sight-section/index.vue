<script setup lang="ts">
  import useSightSectionApi from '@/biz/hooks/sight/sight-section';
  import MSightSection from '@/biz/model/sight/sight-section';
  import { Modal } from '@arco-design/web-vue';
  import { onMounted } from 'vue';

  const formConfig = [
    {
      title: '栏目信息',
      children: [
        {
          type: 'input',
          label: '栏目名称',
          name: 'name',
          bindAttrs: {
            placeholder: '请输入栏目名称',
          },
          rules: {
            required: true,
            message: '请输入栏目名称',
          },
        },
        {
          type: 'input-number',
          label: '排序',
          name: 'sort',
          bindAttrs: {
            min: 0,
            precision: 0,
            placeholder: '数值越小越靠前',
          },
        },
      ],
    },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '栏目名称', dataIndex: 'name', width: 200 },
    { title: '排序', dataIndex: 'sort', width: 100 },
    { title: '创建时间', dataIndex: 'createdAt', width: 180 },
    { title: '操作', slotName: 'operation', width: 140 },
  ];

  const {
    queryParams,
    pageData,
    formModal,
    loadFirstPageData,
    loadCurrentPageData,
    deleteData,
    onFormModal,
    saveSection,
  } = useSightSectionApi();

  const onSaveModal = async () => {
    await saveSection(formModal.value.form);
    formModal.value.show = false;
    loadCurrentPageData();
    return true;
  };

  const onDelete = (section: MSightSection) => {
    Modal.confirm({
      title: '删除栏目',
      content: `确定删除「${section.name}」？删除后不可恢复`,
      okButtonProps: { status: 'danger' },
      onOk: async () => {
        await deleteData(section.id);
        loadCurrentPageData();
      },
    });
  };

  const onReset = () => {
    queryParams.value.name = '';
    loadFirstPageData();
  };

  onMounted(() => {
    loadFirstPageData();
  });
</script>

<template>
  <div class="content">
    <h-form-modal
      v-model:visible="formModal.show"
      v-model="formModal.form"
      width="480px"
      hide-group-title
      :title="formModal.title"
      :config="formConfig"
      :on-before-ok="onSaveModal"
    />

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
            <a-form-item field="name" label="栏目名称">
              <a-input
                v-model.trim="queryParams.name"
                style="width: 280px"
                placeholder="请输入栏目名称"
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
        <div>栏目列表</div>
        <a-button type="primary" size="small" @click="onFormModal('栏目')">
          添加栏目
        </a-button>
      </template>
      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button
            size="small"
            type="text"
            @click="onFormModal('栏目', record)"
          >
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
