<script setup lang="ts">
  import useUserApi from '@/biz/hooks/user/user';
  import MUser from '@/biz/model/user/user';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const { queryParams, pageData, loading, loadFirstPageData } = useUserApi();

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '用户', slotName: 'user', width: 180 },
    { title: '性别', dataIndex: 'gender', width: 60 },
    { title: '手机号', dataIndex: 'mobile', width: 120 },
    { title: '状态', dataIndex: 'status', width: 80 },
    { title: '员工权限', slotName: 'staff', width: 90 },
    { title: '积分余额', dataIndex: 'creditBalance', width: 90 },
    { title: '注册时间', dataIndex: 'createdAt', width: 160 },
    { title: '最近活跃', dataIndex: 'lastActiveAt', width: 160 },
    { title: '操作', slotName: 'operation', width: 100 },
  ];

  const gotoDetail = (record: MUser) => {
    router.push({
      name: 'UserDetail',
      params: { id: String(record.id) },
    });
  };

  const onReset = () => {
    queryParams.value.id = '';
    queryParams.value.nickName = '';
    queryParams.value.mobile = '';
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
            <a-form-item field="id" label="用户 ID">
              <a-input
                v-model.trim="queryParams.id"
                style="width: 140px"
                placeholder="请输入用户 ID"
                allow-clear
                @press-enter="loadFirstPageData()"
                @clear="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="nickName" label="用户昵称">
              <a-input
                v-model.trim="queryParams.nickName"
                style="width: 200px"
                placeholder="请输入用户昵称"
                allow-clear
                @press-enter="loadFirstPageData()"
                @clear="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="mobile" label="手机号">
              <a-input
                v-model.trim="queryParams.mobile"
                style="width: 180px"
                placeholder="请输入手机号"
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

    <h-table
      :loading="loading.page"
      :page-data="pageData"
      :columns="columns"
      :scroll="{ x: 1200 }"
    >
      <template #header>
        <div>用户列表</div>
      </template>
      <template #user="{ record }">
        <div class="user-cell">
          <a-image
            v-if="record.avatar"
            :src="record.avatar"
            width="32"
            height="32"
            fit="cover"
            class="user-cell__avatar"
          />
          <span>{{ record.nickName || '/' }}</span>
        </div>
      </template>
      <template #staff="{ record }">
        <a-tag v-if="record.isStaff" size="small" color="arcoblue">是</a-tag>
        <span v-else class="sub-text">否</span>
      </template>
      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button size="small" type="text" @click="gotoDetail(record)">
            查看详情
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

  .user-cell {
    display: flex;
    gap: 8px;
    align-items: center;

    &__avatar {
      flex-shrink: 0;
      overflow: hidden;
      border-radius: 50%;
    }
  }

  .sub-text {
    color: var(--color-text-3);
    font-size: 12px;
  }
</style>
