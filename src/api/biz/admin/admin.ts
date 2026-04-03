import MAdminInfo from '@/biz/model/admin/admin-info';
import axios from 'axios';
import BASE_URL, { ArgID, ArgPage } from '../../common';

export default {
  GetList(params: ArgPage & { status?: number }) {
    return axios.get(`${BASE_URL.IAM}/admin/list`, { params });
  },

  Create(data: MAdminInfo) {
    return axios.post(`${BASE_URL.IAM}/admin/create`, data);
  },

  Update(data: MAdminInfo) {
    return axios.post(`${BASE_URL.IAM}/admin/update`, data);
  },

  UpdateStatus(data: { userId: number; status: number }) {
    return axios.post(`${BASE_URL.IAM}/admin/update-status`, data);
  },

  UpdateLandingGroups(data: { userId: number; landingGroupIds: number[] }) {
    return axios.post(`${BASE_URL.IAM}/admin/update-landing-groups`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.IAM}/admin/delete`, data);
  },

  ResetPassword(data: { userId: number; password: string }) {
    return axios.post(`${BASE_URL.IAM}/admin/reset-password`, data);
  },
};
