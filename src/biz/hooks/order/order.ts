import { API } from '@/api';
import MOrder from '@/biz/model/order/order';
import HJson from '@/biz/model-base/h-json';
import { Message } from '@arco-design/web-vue';
import useMultiPageData from '../common/multi-page';

export default function useOrderApi() {
  const orderApi = useMultiPageData<MOrder>(API.Order, MOrder);

  const loadOrderDetail = async (orderNo: string) => {
    orderApi.loading.value.detail = true;
    orderApi.detail.value = HJson.fromJson(null, MOrder);
    const { data } = await API.Order.Detail({ orderNo });
    orderApi.detail.value = HJson.fromJson(data, MOrder);
    orderApi.loading.value.detail = false;
    return orderApi.detail.value;
  };

  const submitRefund = async (data: {
    orderNo: string;
    refundAmount: number;
    remark: string;
  }) => {
    await API.Order.SubmitRefund(data);
    Message.success(data.refundAmount <= 0 ? '已提交取消报名' : '退款已提交');
  };

  const cancelAftersale = async (aftersaleOrderNo: string) => {
    await API.Order.CancelAftersale({ aftersaleOrderNo });
    Message.success('已关闭售后');
  };

  return {
    ...orderApi,
    loadOrderDetail,
    submitRefund,
    cancelAftersale,
  };
}
