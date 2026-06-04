import MSightSection from '@/biz/model/sight/sight-section';
import axios from 'axios';
import BASE_URL, { ArgID, ArgPage } from '../../common';

export default {
  Create(data: Partial<MSightSection>) {
    return axios.post(`${BASE_URL.ADMIN}/sight-section/create`, data);
  },

  Update(data: Partial<MSightSection>) {
    return axios.post(`${BASE_URL.ADMIN}/sight-section/update`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.ADMIN}/sight-section/delete`, data);
  },

  Detail(params: ArgID) {
    return axios.get(`${BASE_URL.ADMIN}/sight-section/detail`, { params });
  },

  GetList(params: ArgPage & { name?: string }) {
    return axios.get(`${BASE_URL.ADMIN}/sight-section/list`, { params });
  },
};
