import { API } from '@/api';
import MCommunity from '@/biz/model/operation/community';
import { Message } from '@arco-design/web-vue';
import useMultiPageData from '../common/multi-page';

export default function useCommunityApi() {
  const communityApi = useMultiPageData<MCommunity>(API.Community, MCommunity);

  const saveCommunity = async (record: MCommunity) => {
    const payload = record.toSubmit();
    if (!record.id) {
      await API.Community.Create(payload);
    } else {
      await API.Community.Update(payload);
    }
    Message.success('保存成功');
  };

  return {
    ...communityApi,
    saveCommunity,
  };
}
