<script setup lang="ts">
  import { AdminRoleConfigType } from '@/biz/const/admin-role-config';
  import useAdminRoleConfigApi from '@/biz/hooks/admin/admin-role-config';
  import useAdminMenuApi from '@/biz/hooks/admin/admin-menu';
  import { computed, onMounted, ref } from 'vue';

  const props = defineProps<{
    id?: number;
    disabled?: boolean;
    onOk?: () => boolean | undefined;
  }>();

  const { detail, loadDetail, saveData } = useAdminRoleConfigApi();
  const { allData, loadAllData: loadMenuList } = useAdminMenuApi();

  const formRef = ref();
  const expandedKeys = ref<number[]>([]);
  const isReadonly = computed(() => props.disabled);

  const menuTreeData = computed(() => {
    return allData.value.map((item) => ({
      title: item.name,
      key: item.id,
      children: item.items
        ? item.items.map((child) => ({
            title: child.name,
            key: child.id,
          }))
        : [],
    }));
  });

  onMounted(async () => {
    await loadMenuList();
    await loadDetail(props.id || 0);
    expandedKeys.value = allData.value.map((item) => item.id);
    detail.value.menuIds = detail.value.menuIds || [];
    if (!props.id) {
      detail.value.type = AdminRoleConfigType.Custom;
    }
  });

  const handleOk = async () => {
    if (isReadonly.value) {
      return false;
    }
    const errs = await formRef.value.validate();
    if (errs) {
      return false;
    }
    await saveData(detail.value);
    return props.onOk?.();
  };
</script>

<template>
  <a-drawer
    :title="id ? (!isReadonly ? '编辑角色' : '查看角色') : '新增角色'"
    :width="500"
    :footer="!isReadonly"
    v-bind="$attrs"
    @before-ok="handleOk"
  >
    <a-form ref="formRef" :model="detail" auto-label-width label-align="left">
      <a-form-item
        label="角色名称"
        field="name"
        :rules="[{ required: true, message: '请输入角色名称' }]"
      >
        <a-input
          v-model="detail.name"
          :disabled="isReadonly"
          placeholder="请输入角色名称"
        />
      </a-form-item>
      <a-form-item
        label="角色权限"
        field="menuIds"
        :rules="[
          {
            required: true,
            message: '请选择角色权限',
            type: 'array',
          },
        ]"
      >
        <a-tree
          v-model:checked-keys="detail.menuIds"
          v-model:expanded-keys="expandedKeys"
          :data="menuTreeData"
          checkable
          :disabled="isReadonly"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
