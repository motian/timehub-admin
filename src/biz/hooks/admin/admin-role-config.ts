import { API } from '@/api';
import MAdminRoleConfig from '@/biz/model/admin/admin-role-config';
import useMultiPageData from '../common/multi-page';

export default function useAdminRoleConfigApi() {
  const adminRoleConfigApi = useMultiPageData<MAdminRoleConfig>(
    API.AdminRoleConfig,
    MAdminRoleConfig
  );

  return {
    ...adminRoleConfigApi,
  };
}
