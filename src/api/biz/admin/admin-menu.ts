import BASE_URL, { ArgID, ArgPage } from '@/api/common';
import MAdminMenu from '@/biz/model/admin/admin-menu';
import axios from 'axios';

export default {
  GetList(params: ArgPage) {
    return axios.get(`${BASE_URL.ADMIN}/admin-menu/list`, { params });
  },

  GetCurrent() {
    return axios.get(`${BASE_URL.ADMIN}/admin-menu/current`, {});
  },

  Create(data: MAdminMenu) {
    return axios.post(`${BASE_URL.ADMIN}/admin-menu/create`, data);
  },

  Update(data: MAdminMenu) {
    return axios.post(`${BASE_URL.ADMIN}/admin-menu/update`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.ADMIN}/admin-menu/delete`, data);
  },
};
