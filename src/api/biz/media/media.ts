import MMedia from '@/biz/model/media/media';
import axios from 'axios';
import BASE_URL, { ArgID } from '../../common';

interface ArgBatchCreate {
  type: string;
  bizId: number;
  medias: MMedia[];
}

export default {
  GetToken(data?: { forceSaveKey?: boolean; mimeLimit?: string }) {
    return axios.post(`${BASE_URL.ADMIN}/media/token`, data);
  },

  BatchCreate(data: ArgBatchCreate) {
    return axios.post(`${BASE_URL.ADMIN}/media/batch-create`, data);
  },

  Delete(data: ArgID) {
    return axios.post(`${BASE_URL.ADMIN}/media/delete`, data);
  },

  BatchDelete(data: { type: string; bizId: number; ids: number[] }) {
    return axios.post(`${BASE_URL.ADMIN}/media/batch-delete`, data);
  },

  GetList(params: { type: string; bizId: number; onlyTrashed?: boolean }) {
    return axios.get(`${BASE_URL.ADMIN}/media/list`, { params });
  },

  UpdateSort(data: { type: string; data: { id: number; sort: number }[] }) {
    return axios.post(`${BASE_URL.ADMIN}/media/update-sort`, data);
  },
};
