import MSight from '@/biz/model/sight/sight';
import axios from 'axios';
import BASE_URL, { ArgID, ArgPage } from '../../common';

export default {
  Create(data: Partial<MSight>) {
    return axios.post(`${BASE_URL.ADMIN}/sight/create`, data);
  },

  Update(data: Partial<MSight>) {
    return axios.post(`${BASE_URL.ADMIN}/sight/update`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.ADMIN}/sight/delete`, data);
  },

  Detail(params: ArgID) {
    return axios.get(`${BASE_URL.ADMIN}/sight/detail`, { params });
  },

  GetList(params: ArgPage & { sectionId?: number; title?: string }) {
    return axios.get(`${BASE_URL.ADMIN}/sight/list`, { params });
  },
};
