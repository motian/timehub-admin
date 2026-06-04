import MCommunity from '@/biz/model/operation/community';
import axios from 'axios';
import BASE_URL, { ArgID, ArgPage } from '../../common';

export default {
  Create(data: Partial<MCommunity>) {
    return axios.post(`${BASE_URL.ADMIN}/community/create`, data);
  },

  Update(data: Partial<MCommunity>) {
    return axios.post(`${BASE_URL.ADMIN}/community/update`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.ADMIN}/community/delete`, data);
  },

  Detail(params: ArgID) {
    return axios.get(`${BASE_URL.ADMIN}/community/detail`, { params });
  },

  GetList(params: ArgPage & { title?: string }) {
    return axios.get(`${BASE_URL.ADMIN}/community/list`, { params });
  },
};
