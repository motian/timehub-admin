import BASE_URL, { ArgID, ArgPage } from '@/api/common';
import MAdminRoleConfig from '@/biz/model/admin/admin-role-config';
import axios from 'axios';

export default {
  GetList(params: ArgPage) {
    return axios.get(`${BASE_URL.ADMIN}/admin-role-config/list`, { params });
  },

  Create(data: MAdminRoleConfig) {
    return axios.post(`${BASE_URL.ADMIN}/admin-role-config/create`, data);
  },

  Update(data: MAdminRoleConfig) {
    return axios.post(`${BASE_URL.ADMIN}/admin-role-config/update`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.ADMIN}/admin-role-config/delete`, data);
  },

  Detail(params: ArgID) {
    return axios.get(`${BASE_URL.ADMIN}/admin-role-config/detail`, { params });
  },
};
