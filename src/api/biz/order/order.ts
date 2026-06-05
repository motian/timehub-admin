import axios from 'axios';
import BASE_URL, { ArgPage } from '../../common';

export interface ArgOrderList extends ArgPage {
  userId?: number;
  status?: number;
  orderNo?: string;
  mobile?: string;
  title?: string;
}

export default {
  GetList(params: ArgOrderList) {
    return axios.get(`${BASE_URL.ADMIN}/order/list`, { params });
  },

  Detail(params: { orderNo: string }) {
    return axios.get(`${BASE_URL.ADMIN}/order/detail`, { params });
  },

  SubmitRefund(data: {
    orderNo: string;
    refundAmount?: number;
    remark?: string;
    aftersaleOrderNo?: string;
    photos?: string[];
  }) {
    return axios.post(`${BASE_URL.ADMIN}/order/submit-refund`, data);
  },

  CancelAftersale(data: { aftersaleOrderNo: string }) {
    return axios.post(`${BASE_URL.ADMIN}/order/cancel-aftersale`, data);
  },
};
