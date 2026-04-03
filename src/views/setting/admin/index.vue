<script setup lang="ts">
  import { getOptions } from '@/biz/const/common';
  import CUser from '@/biz/const/user';
  import useAdminRoleConfigApi from '@/biz/hooks/admin/admin-role-config';
  import useAdminApi from '@/biz/hooks/admin/admin';
  import useAdminTeamApi from '@/biz/hooks/admin/admin-team';
  import { getFormatValue } from '@/biz/model-base/decorator/metada';
  import MAdminInfo from '@/biz/model/admin/admin-info';
  import MAdminTeam from '@/biz/model/admin/admin-team';
  import { useUserStore } from '@/store';
  import type { FormInstance } from '@arco-design/web-vue';
  import { Message, TableColumnData } from '@arco-design/web-vue';
  import md5 from 'md5';
  import { computed, ref } from 'vue';

  const { userInfo } = useUserStore();

  const columns: TableColumnData[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 150,
    },
    // 当前是超管，则显示所属团队
    userInfo.isSuperManager
      ? {
          title: '所属团队',
          slotName: 'teamName',
          width: 150,
        }
      : false,
    {
      title: '角色',
      dataIndex: 'role.name',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 60,
    },
    {
      title: '操作',
      slotName: 'operation',
      width: 200,
    },
  ].filter(Boolean) as TableColumnData[];

  const superTeamConfig = [
    {
      slotName: 'teamId',
      rules: [
        {
          type: 'number',
          required: true,
          positive: true,
          message: '请选择所属组织',
        },
      ],
    },
    {
      label: '角色',
      slotName: 'roleId',
      rules: [
        {
          type: 'number',
          required: true,
          positive: true,
          message: '请选择角色',
        },
      ],
    },
  ];

  const customerTeamConfig = [
    {
      label: '角色',
      slotName: 'roleId',
      rules: [
        {
          type: 'number',
          required: true,
          positive: true,
          message: '请选择角色',
        },
      ],
    },
  ];

  const formConfig = [
    {
      title: '账号信息',
      children: [
        {
          label: '姓名',
          type: 'input',
          name: 'name',
          bindAttrs: {
            placeholder: '请输入姓名',
          },
          rules: [
            {
              required: true,
              message: '请输入姓名',
            },
          ],
        },
        {
          label: '性别',
          type: 'radio-group',
          name: 'gender',
          bindAttrs: {
            options: getOptions(CUser.Gender),
          },
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          label: '手机号',
          type: 'input',
          name: 'mobile',
          bindAttrs: {
            placeholder: '请输入手机号',
          },
          rules: [
            {
              required: true,
              message: '请输入手机号',
            },
          ],
        },
        ...(userInfo.isSuperManager ? superTeamConfig : customerTeamConfig),
        {
          label: '备注',
          type: 'input',
          name: 'remark',
          bindAttrs: {
            placeholder: '请输入备注信息',
          },
        },
      ],
    },
  ];

  const expandedKeys = ref<number[]>([]);
  const resetFormRef = ref<FormInstance>();
  const passwordModal = ref({
    show: false,
    user: new MAdminInfo(),
    form: {
      userId: 0,
      password: '',
      password2: '',
    },
  });

  const {
    formModal,
    pageData,
    queryParams,
    loadFirstPageData,
    loadCurrentPageData,
    saveData,
    updateStatus,
    resetPassword,
    onFormModal,
  } = useAdminApi();
  const { allData: teamList, teamTree, loadTreeData } = useAdminTeamApi();
  const { allData: roleList, loadAllData: loadRoleList } =
    useAdminRoleConfigApi();

  const roleOptions = computed(() => {
    // type === 0 时为超管角色， 可选择所有角色
    if (userInfo.role?.type === 0) {
      return roleList.value;
    }
    // 非超级管理员，仅可选择除「超级管理员」以外的角色
    return roleList.value.filter((role) => role.type !== 0);
  });

  const getTeamName = (record: MAdminTeam) => {
    const currentTeam = teamList.value.find((item) => item.id === record.id);
    const parentTeam = teamList.value.find(
      (item) => item.id === record.parentId
    );
    if (parentTeam?.name) {
      return `${parentTeam?.name} / ${currentTeam?.name}`;
    }
    return currentTeam?.name;
  };

  function onShowTeamModal() {
    onFormModal('账号');
    const teamId = formModal.value.form.teamId || teamTree.value?.[0].id;
    formModal.value.form.teamId = teamId;
  }

  function onPasswordModal(record: MAdminInfo) {
    passwordModal.value.user = record;
    passwordModal.value.form.userId = record.id;
    passwordModal.value.show = true;
  }

  async function onResetPassword() {
    const errors = await resetFormRef.value?.validate();
    if (errors) {
      const key = Object.keys(errors)?.[0];
      Message.warning(errors?.[key]?.message);
      return false;
    }
    const { password, password2 } = passwordModal.value.form;
    if (password !== password2) {
      Message.warning('密码不一致，请确认后重新输入!');
      return false;
    }
    await resetPassword({
      userId: passwordModal.value.form.userId,
      password: md5(password),
    });
    Message.success('修改成功!');
    return true;
  }

  queryParams.value.status = 1;
  loadRoleList();
  loadFirstPageData();
  loadTreeData(false, true);
</script>

<template>
  <div>
    <a-modal
      v-model:visible="passwordModal.show"
      width="480px"
      title="重置密码"
      :on-before-ok="onResetPassword"
    >
      <a-form ref="resetFormRef" :model="passwordModal.form" auto-label-width>
        <a-form-item label="用户">
          <span>{{ passwordModal.user.name }}</span>
        </a-form-item>
        <a-form-item
          label="密码"
          field="password"
          :rules="[{ required: true, message: '请输入账号密码' }]"
        >
          <a-input-password
            v-model="passwordModal.form.password"
            placeholder="请输入账号密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
          field="password2"
          :rules="[{ required: true, message: '请确认账号密码' }]"
        >
          <a-input-password
            v-model="passwordModal.form.password2"
            placeholder="请输入账号密码"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <h-form-modal
      v-model:visible="formModal.show"
      v-model="formModal.form"
      width="500px"
      hide-group-title
      :title="formModal.title"
      :config="formConfig"
      :on-before-ok="() => saveData(formModal.form, loadCurrentPageData)"
    >
      <template #teamId="{ formItem }">
        <a-form-item label="所属团队" field="teamId" :rules="formItem.rules">
          <a-cascader
            v-model="formModal.form.teamId"
            size="small"
            check-strictly
            expand-trigger="hover"
            :options="teamTree"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择所属团队"
          />
        </a-form-item>
      </template>
      <template #roleId="{ formItem }">
        <a-form-item label="角色" field="roleId" :rules="formItem.rules">
          <h-select
            v-model="formModal.form.roleId"
            size="small"
            :empty-value="0"
            :options="roleOptions"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择角色"
          />
        </a-form-item>
      </template>
    </h-form-modal>

    <a-card class="user-card">
      <div class="h-flex-jsb">
        <div class="action-bar">
          <div v-if="userInfo.isSuperManager" class="h-flex wm-r-15">
            <div class="label">团队：</div>
            <h-cascader
              v-model="queryParams.teamId"
              allow-clear
              style="width: 250px"
              size="small"
              check-strictly
              :options="teamTree"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择所属团队"
              @change="loadFirstPageData()"
            />
          </div>
          <div class="h-flex wm-r-15">
            <div class="label">账号状态：</div>
            <a-select
              v-model="queryParams.status"
              style="width: 120px"
              size="small"
              allow-clear
              :options="getOptions(['启用', '禁用'])"
              placeholder="请选择状态"
              @change="loadFirstPageData()"
            />
          </div>
          <a-input-search
            v-model.trim="queryParams.keyword"
            style="width: 300px"
            search-button
            button-text="搜索"
            size="small"
            placeholder="员工姓名或手机号"
            class="wm-r-10"
            allow-clear
            @press-enter="loadFirstPageData()"
            @clear="loadFirstPageData()"
            @search="loadFirstPageData()"
          />
        </div>
        <a-button size="small" type="primary" @click="onShowTeamModal">
          添加账号
        </a-button>
      </div>
    </a-card>

    <h-table
      v-model:expanded-keys="expandedKeys"
      :page-data="pageData"
      :columns="columns"
    >
      <template #header>
        <div>账号管理</div>
      </template>
      <template #type="{ record }">
        {{ getFormatValue(record, 'type') }}
      </template>
      <template #teamName="{ record }">
        {{ getTeamName(record.team) }}
      </template>
      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button
            size="small"
            type="text"
            @click="onFormModal('账号', record)"
          >
            编辑
          </a-button>
          <a-divider direction="vertical" :margin="0" />
          <a-button size="small" type="text" @click="onPasswordModal(record)">
            重置密码
          </a-button>
        </div>
        <div class="h-tb-btn">
          <a-popconfirm
            v-if="record.status === 1"
            :content="`确定禁用账号${record.name}吗？`"
            @ok="updateStatus(record.id, record.status, loadCurrentPageData)"
          >
            <a-button size="small" type="text" status="danger"> 禁用 </a-button>
          </a-popconfirm>
          <a-popconfirm
            v-else
            :content="`确定启用账号${record.name}吗？`"
            @ok="updateStatus(record.id, record.status, loadCurrentPageData)"
          >
            <a-button size="small" type="text" status="danger"> 启用 </a-button>
          </a-popconfirm>
        </div>
      </template>
    </h-table>
  </div>
</template>

<style lang="less" scoped>
  .user-card {
    margin-top: -1px;
    margin-bottom: 15px;

    .action-bar {
      display: flex;
      flex-direction: row;
      align-items: center;

      .label {
        flex-shrink: 0;
        color: @color-text-1;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
</style>
