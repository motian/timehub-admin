import { API } from '@/api';
import HJson from '@/biz/model-base/h-json';
import MAdminInfo from '@/biz/model/admin/admin-info';
import MAdminManagedData from '@/biz/model/admin/admin-managed-data';
import { Message } from '@arco-design/web-vue';
import { ref } from 'vue';
import useMultiPageData, { OnAfterAction } from '../common/multi-page';

export default function useAdminApi() {
  const adminApi = useMultiPageData<MAdminInfo>(API.Admin, MAdminInfo);
  const adminList = ref<MAdminInfo[]>([]);
  const adminManagedData = ref<MAdminManagedData>(new MAdminManagedData());

  async function getAllAdminList() {
    const { data } = await API.Admin.GetList({
      status: 1,
      page: 1,
      pageSize: 1000,
    });
    adminList.value = HJson.fromJsonArray(data.list, MAdminInfo);
  }

  function getAdminNameById(id: number) {
    return adminList.value.find((admin) => admin.id === id)?.name || '';
  }

  async function resetPassword(data: { userId: number; password: string }) {
    await API.Admin.ResetPassword(data);
  }

  async function updateStatus(
    userId: number,
    status: number,
    callback: OnAfterAction | null = null
  ) {
    const targetStatus = status === 1 ? 2 : 1;
    await API.Admin.UpdateStatus({ userId, status: targetStatus });
    Message.success(targetStatus === 1 ? '启用成功' : '禁用成功');
    if (callback) {
      callback();
    }
  }

  async function updateLandingGroups(
    userId: number,
    landingGroupIds: number[]
  ) {
    return API.Admin.UpdateLandingGroups({ userId, landingGroupIds });
  }

  return {
    ...adminApi,
    adminList,
    adminManagedData,
    getAdminNameById,
    getAllAdminList,
    resetPassword,
    updateStatus,
    updateLandingGroups,
  };
}
