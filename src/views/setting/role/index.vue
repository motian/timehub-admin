<script lang="ts" setup>
  import {
    canDeleteAdminRole,
    isCustomAdminRole,
  } from '@/biz/const/admin-role-config';
  import useAdminRoleConfigApi from '@/biz/hooks/admin/admin-role-config';
  import MAdminRoleConfig from '@/biz/model/admin/admin-role-config';
  import { useUserStore } from '@/store';
  import { Modal } from '@arco-design/web-vue';
  import { computed, onMounted } from 'vue';
  import openRolePermissionModal from './components';

  const { userInfo } = useUserStore();

  const {
    queryParams,
    loading,
    pageData,
    deleteData,
    loadFirstPageData,
    loadCurrentPageData,
  } = useAdminRoleConfigApi();

  onMounted(() => {
    loadFirstPageData();
  });

  const handleSearch = () => {
    loadFirstPageData();
  };

  const handleReset = () => {
    queryParams.value.name = '';
    loadFirstPageData();
  };

  const columns = computed(() => [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      slotName: 'type',
      width: 120,
    },
    {
      title: '启用中成员数',
      dataIndex: 'adminCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '创建人',
      dataIndex: 'creator.name',
    },
    {
      title: '操作',
      slotName: 'operation',
      width: 200,
    },
  ]);

  const formatRoleType = (type: number) => {
    if (type === 0) return '超级管理员';
    if (type === 1) return '系统内置';
    return '自定义';
  };

  const handleAdd = () => {
    openRolePermissionModal({
      onOk: () => {
        loadCurrentPageData();
      },
    });
  };

  const handleDetail = (record: MAdminRoleConfig) => {
    openRolePermissionModal({
      id: record.id,
      disabled: true,
    });
  };

  const handleEdit = (record: MAdminRoleConfig) => {
    openRolePermissionModal({
      id: record.id,
      onOk: () => {
        loadCurrentPageData();
      },
    });
  };

  const handleDelete = (record: MAdminRoleConfig) => {
    if (!canDeleteAdminRole(record)) {
      if (record.adminCount > 0) {
        Modal.warning({
          title: '无法删除',
          content: '该角色下仍有成员，请先调整成员角色后再删除。',
        });
      }
      return;
    }
    Modal.confirm({
      title: '删除角色',
      content: '确定要删除该角色吗？删除后不可恢复。',
      okButtonProps: {
        status: 'danger',
      },
      onOk: async () => {
        await deleteData(record.id);
        loadCurrentPageData();
      },
    });
  };
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
            <a-form-item label="角色名称" field="name">
              <a-input
                v-model.trim="queryParams.name"
                style="width: 240px"
                placeholder="请输入角色名称"
                allow-clear
                @press-enter="handleSearch"
                @clear="handleSearch"
              />
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :flex="'200px'" style="text-align: right">
          <a-space>
            <a-button type="primary" size="small" @click="handleSearch">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button size="small" @click="handleReset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <h-table
      size="small"
      :loading="loading.page"
      :columns="columns"
      :page-data="pageData"
      table-layout-fixed
      :scroll="{
        x: 'max-content',
      }"
    >
      <template #header>
        <div>角色管理</div>
        <a-space direction="vertical" align="end" :size="4">
          <a-button
            v-if="userInfo.isSuperManager"
            type="primary"
            size="small"
            @click="handleAdd"
          >
            新增角色
          </a-button>
        </a-space>
      </template>

      <template #type="{ record }">
        {{ formatRoleType(record.type) }}
      </template>

      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button size="small" type="text" @click="handleDetail(record)">
            详情
          </a-button>
          <a-divider direction="vertical" :margin="0" />
          <a-button size="small" type="text" @click="handleEdit(record)">
            编辑
          </a-button>
          <template v-if="isCustomAdminRole(record.type)">
            <a-divider direction="vertical" :margin="0" />
            <a-button
              size="small"
              status="danger"
              type="text"
              :disabled="!canDeleteAdminRole(record)"
              @click="handleDelete(record)"
            >
              删除
            </a-button>
          </template>
        </div>
      </template>
    </h-table>
  </div>
</template>

<style lang="less" scoped>
  .content {
    margin: -1px auto 0;
  }

  .role-tip {
    max-width: 420px;
    color: var(--color-text-3);
    font-size: 12px;
    text-align: right;
  }
</style>
