import {
  isFreeActivityOrder,
  isScheduleCancelAftersale,
} from '@/biz/const/order';
import MOrder from '@/biz/model/order/order';
import modalCompFunctionalize from '@/utils/modalCompFunctionalize';
import { Modal } from '@arco-design/web-vue';
import OrderRefundModal from './order-refund-modal.vue';

const openOrderRefundModal = modalCompFunctionalize(OrderRefundModal);

type RefundFormData = {
  orderNo: string;
  refundAmount: number;
  remark: string;
};

export default function openOrderRefund(options: {
  order: MOrder;
  submitRefund: (data: RefundFormData) => Promise<void>;
  onSuccess?: () => unknown | Promise<unknown>;
}) {
  const { order, submitRefund, onSuccess } = options;
  if (isScheduleCancelAftersale(order.aftersale)) {
    Modal.warning({
      title: '提示',
      content: isFreeActivityOrder(order)
        ? '活动已取消，系统将自动取消报名，请勿重复操作'
        : '活动已取消，系统将自动退款，请勿重复操作',
    });
    return;
  }
  openOrderRefundModal({
    orderNo: order.orderNo,
    payAmount: Number(order.payAmount || 0),
    feeType: order.product?.feeType ?? 0,
    onSubmit: async (data: RefundFormData) => {
      await submitRefund(data);
      await onSuccess?.();
    },
  });
}
