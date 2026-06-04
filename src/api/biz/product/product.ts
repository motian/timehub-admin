import MProduct from '@/biz/model/product/product';
import axios from 'axios';
import BASE_URL, { ArgID, ArgPage } from '../../common';

export default {
  Create(data: Partial<MProduct>) {
    return axios.post(`${BASE_URL.ADMIN}/product/create`, data);
  },

  Update(data: Partial<MProduct>) {
    return axios.post(`${BASE_URL.ADMIN}/product/update`, data);
  },

  UpdateStatus(data: { id: number; status: number }) {
    return axios.post(`${BASE_URL.ADMIN}/product/update-status`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.ADMIN}/product/delete`, data);
  },

  Detail(params: ArgID) {
    return axios.get(`${BASE_URL.ADMIN}/product/detail`, { params });
  },

  GetList(
    params: ArgPage & { type?: number; status?: number; title?: string }
  ) {
    return axios.get(`${BASE_URL.ADMIN}/product/list`, { params });
  },

  CancelActivity(data: { productId: number; remark?: string }) {
    return axios.post(`${BASE_URL.ADMIN}/product/cancel-activity`, data);
  },
};
