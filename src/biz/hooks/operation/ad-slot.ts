import { API } from '@/api';
import MAdSlot from '@/biz/model/operation/ad-slot';
import { Message } from '@arco-design/web-vue';
import useMultiPageData from '../common/multi-page';

export default function useAdSlotApi() {
  const adSlotApi = useMultiPageData<MAdSlot>(API.AdSlot, MAdSlot);

  const saveAdSlot = async (record: MAdSlot) => {
    const payload = record.toSubmit();
    if (!record.id) {
      await API.AdSlot.Create(payload);
    } else {
      await API.AdSlot.Update(payload);
    }
    Message.success('保存成功');
  };

  return {
    ...adSlotApi,
    saveAdSlot,
  };
}
