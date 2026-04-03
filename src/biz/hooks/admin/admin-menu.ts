import { API } from '@/api';
import HJson from '@/biz/model-base/h-json';
import MAdminMenu from '@/biz/model/admin/admin-menu';
import useMultiPageData from '../common/multi-page';

export default function useAdminMenuApi() {
  const adminMenu = useMultiPageData<MAdminMenu>(API.AdminMenu, MAdminMenu);

  // 获取当前用户的菜单列表
  const getCurrentMenuList = async () => {
    const { data } = await API.AdminMenu.GetCurrent();
    return HJson.fromJsonArray(data, MAdminMenu);
  };

  return {
    ...adminMenu,
    getCurrentMenuList,
  };
}
