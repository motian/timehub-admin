import axios from 'axios';
import BASE_URL, { ArgID, ArgPage } from '../../common';

export interface ArgUserList extends ArgPage {
  id?: string;
  nickName?: string;
  name?: string;
  mobile?: string;
}

export default {
  GetList(params: ArgUserList) {
    return axios.get(`${BASE_URL.ADMIN}/user/list`, { params });
  },

  Detail(params: ArgID) {
    return axios.get(`${BASE_URL.ADMIN}/user/detail`, { params });
  },
};
