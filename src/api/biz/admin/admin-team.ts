import MAdminTeam from '@/biz/model/admin/admin-team';
import axios from 'axios';
import BASE_URL, { ArgID, ArgPage } from '../../common';

export default {
  GetList(params: ArgPage) {
    return axios.get(`${BASE_URL.IAM}/admin-team/list`, { params });
  },

  Create(data: MAdminTeam) {
    return axios.post(`${BASE_URL.IAM}/admin-team/create`, data);
  },

  Update(data: MAdminTeam) {
    return axios.post(`${BASE_URL.IAM}/admin-team/update`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.IAM}/admin-team/delete`, data);
  },
};
