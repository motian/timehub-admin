<script setup lang="ts">
  import useAdminTeamApi from '@/biz/hooks/admin/admin-team';
  import { useUserStore } from '@/store';
  import { TableColumnData } from '@arco-design/web-vue';
  import { computed, onMounted, ref } from 'vue';

  const columns: TableColumnData[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180,
    },
    {
      title: '团队名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '类型',
      slotName: 'type',
      width: 100,
    },
    {
      title: 'PV专属价格',
      dataIndex: 'vipPrice',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 150,
    },
  ];

  const formConfig = [
    {
      title: '团队信息',
      children: [
        {
          label: '类型',
          slotName: 'type',
          rules: [
            {
              type: 'number',
              required: true,
              positive: true,
              message: '请选择团队类型',
            },
          ],
        },
        {
          label: '团队名称',
          type: 'input',
          name: 'name',
          bindAttrs: {
            placeholder: '请输入团队名称',
          },
          rules: [
            {
              required: true,
              message: '请输入团队名称',
            },
          ],
        },
        {
          slotName: 'parentId',
          rules: [
            {
              type: 'number',
              required: true,
              positive: true,
              message: '请选择上级团队',
            },
          ],
        },
        {
          label: 'PV专属价格',
          type: 'input-number',
          name: 'vipPrice',
          bindAttrs: {
            placeholder: '请输入PV专属价格',
            append: '元 / PV',
          },
          rules: [
            {
              type: 'number',
              required: true,
              min: 0,
              message: '请输入PV专属价格',
            },
          ],
        },
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

  const { userInfo } = useUserStore();
  const expandedKeys = ref<number[]>([]);
  const {
    formModal,
    allData,
    teamTree,
    loadTreeData,
    saveData,
    deleteData,
    onFormModal,
  } = useAdminTeamApi();
  const tableColumns = computed(() => {
    if (userInfo.isSuperManager) {
      return [
        ...columns,
        {
          title: '操作',
          slotName: 'operation',
          width: 200,
        },
      ];
    }
    return columns;
  });

  const onShowTeamModal = () => {
    onFormModal('团队');
    const parentId = formModal.value.form.parentId || teamTree.value?.[0].id;
    formModal.value.form.parentId = parentId;
  };

  onMounted(async () => {
    await loadTreeData(true, true);
    expandedKeys.value = allData.value.map((team) => team.id);
  });
</script>

<template>
  <div>
    <h-form-modal
      v-model:visible="formModal.show"
      v-model="formModal.form"
      width="500px"
      hide-group-title
      :title="formModal.title"
      :config="formConfig"
      :on-before-ok="() => saveData(formModal.form, loadTreeData)"
    >
      <template #type="{ formItem }">
        <a-form-item label="类型" field="type" :rules="formItem.rules">
          <a-radio-group v-model="formModal.form.type">
            <a-radio :value="1" :disabled="userInfo.team.type > 1">
              {{ userInfo.team.parentId === 0 ? '总代理' : '代理商' }}
            </a-radio>
            <a-radio :value="2" :disabled="userInfo.team.type >= 2">
              公司
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </template>
      <template #parentId="{ formItem }">
        <a-form-item label="上级团队" field="parentId" :rules="formItem.rules">
          <h-cascader
            v-model="formModal.form.parentId"
            size="mini"
            check-strictly
            :options="teamTree"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择上级团队"
          />
        </a-form-item>
      </template>
    </h-form-modal>
    <h-table
      v-model:expanded-keys="expandedKeys"
      class="content"
      :data="teamTree"
      :pagination="false"
      :columns="tableColumns"
      row-key="id"
      :auto-format="false"
    >
      <template #header>
        <div>团队管理</div>
        <a-button
          v-if="userInfo.isSuperManager"
          type="primary"
          @click="onShowTeamModal"
        >
          添加团队
        </a-button>
      </template>
      <template #type="{ record }">
        <div class="h-flex">
          <a-tag v-if="record.type === 1" color="#f53f3f" size="small">
            代理商
          </a-tag>
          <a-tag v-if="record.type === 2" color="#168cff" size="small">
            公司
          </a-tag>
          <a-tag v-if="record.type === 3" color="#14c9c9" size="small">
            部门
          </a-tag>
          <a-tag
            v-if="record.corpId"
            class="wm-l-10"
            color="#ffb400"
            size="small"
          >
            企微
          </a-tag>
        </div>
      </template>
      <template v-if="userInfo.isSuperManager" #operation="{ record }">
        <a-space class="h-tb-btn">
          <a-button
            :disabled="userInfo.teamId === record.id"
            size="small"
            type="text"
            @click="onFormModal('团队', record)"
          >
            编辑
          </a-button>
          <a-divider direction="vertical" :margin="0" />
          <a-popconfirm
            :content="`您确定要删除团队「${record.name}」吗？`"
            @ok="deleteData(record.id, loadTreeData)"
          >
            <a-button
              :disabled="userInfo.teamId === record.id"
              size="small"
              type="text"
              status="danger"
            >
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </h-table>
  </div>
</template>

<style lang="less" scoped>
  .content {
    margin-top: 15px;
  }
</style>
