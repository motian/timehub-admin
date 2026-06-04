<script setup lang="ts">
  import useCommunityApi from '@/biz/hooks/operation/community';
  import MCommunity from '@/biz/model/operation/community';
  import { Modal } from '@arco-design/web-vue';
  import { onMounted } from 'vue';

  const formConfig = [
    {
      title: '社区信息',
      children: [
        {
          type: 'input',
          label: '名称',
          name: 'title',
          bindAttrs: {
            placeholder: '请输入社区名称',
          },
          rules: {
            required: true,
            message: '请输入社区名称',
          },
        },
        {
          label: '封面图',
          slotName: 'cover',
          rules: {
            required: true,
            validator: (value: string, callback: (msg?: string) => void) => {
              if (!value?.trim()) {
                callback('请上传封面图');
                return;
              }
              callback();
            },
          },
        },
      ],
    },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '封面', slotName: 'cover', width: 100 },
    { title: '名称', dataIndex: 'title', width: 200 },
    { title: '点赞量', dataIndex: 'likeCount', width: 100 },
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
    saveCommunity,
  } = useCommunityApi();

  const onCoverUpload = (_: unknown, res: { url: string }) => {
    formModal.value.form.cover = res.url;
  };

  const onSaveModal = async () => {
    await saveCommunity(formModal.value.form);
    formModal.value.show = false;
    loadCurrentPageData();
    return true;
  };

  const onDelete = (record: MCommunity) => {
    Modal.confirm({
      title: '删除社区',
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
    loadFirstPageData();
  });
</script>

<template>
  <div class="content">
    <h-form-modal
      v-model:visible="formModal.show"
      v-model="formModal.form"
      width="520px"
      hide-group-title
      :title="formModal.title"
      :config="formConfig"
      :on-before-ok="onSaveModal"
    >
      <template #cover="{ formItem }">
        <a-form-item label="封面图" field="cover" :rules="formItem.rules">
          <h-media-upload
            :media-list="
              formModal.form.cover ? [{ url: formModal.form.cover }] : []
            "
            :limit="1"
            :max-size="10"
            :width="150"
            :height="74"
            accept="image/jpg,image/jpeg,image/png"
            @upload="onCoverUpload"
            @remove="() => (formModal.form.cover = '')"
          />
          <template #extra>大小不超过 10M，支持 JPG/PNG 格式</template>
        </a-form-item>
      </template>
    </h-form-modal>

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
                placeholder="请输入社区名称"
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
        <div>社区烟火气列表</div>
        <a-button type="primary" size="small" @click="onFormModal('社区')">
          添加社区
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
      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button
            size="small"
            type="text"
            @click="onFormModal('社区', record)"
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
