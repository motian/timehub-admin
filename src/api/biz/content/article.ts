import MArticle from '@/biz/model/article/article';
import axios from 'axios';
import BASE_URL, { ArgID, ArgPage } from '../../common';

export default {
  Create(data: Partial<MArticle>) {
    return axios.post(`${BASE_URL.ADMIN}/article/create`, data);
  },

  Update(data: Partial<MArticle>) {
    return axios.post(`${BASE_URL.ADMIN}/article/update`, data);
  },

  UpdateStatus(data: { id: number; status: number }) {
    return axios.post(`${BASE_URL.ADMIN}/article/update-status`, data);
  },

  UpdateContent(data: { id: number; content: string }) {
    return axios.post(`${BASE_URL.ADMIN}/article/update-content`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.ADMIN}/article/delete`, data);
  },

  Detail(params: ArgID) {
    return axios.get(`${BASE_URL.ADMIN}/article/detail`, { params });
  },

  GetList(
    params: ArgPage & { type?: number; status?: number; title?: string }
  ) {
    return axios.get(`${BASE_URL.ADMIN}/article/list`, { params });
  },
};
