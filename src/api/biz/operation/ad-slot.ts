import MAdSlot from '@/biz/model/operation/ad-slot';
import axios from 'axios';
import BASE_URL, { ArgID, ArgPage } from '../../common';

export default {
  Create(data: Partial<MAdSlot>) {
    return axios.post(`${BASE_URL.ADMIN}/ad-slot/create`, data);
  },

  Update(data: Partial<MAdSlot>) {
    return axios.post(`${BASE_URL.ADMIN}/ad-slot/update`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.ADMIN}/ad-slot/delete`, data);
  },

  Detail(params: ArgID) {
    return axios.get(`${BASE_URL.ADMIN}/ad-slot/detail`, { params });
  },

  GetList(params: ArgPage & { type?: number; title?: string }) {
    return axios.get(`${BASE_URL.ADMIN}/ad-slot/list`, { params });
  },
};
