import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';
import { useClipboard } from '@vueuse/core';

export default function useCopy() {
  const { userInfo } = useUserStore();
  const { copy: clipboardCopy } = useClipboard();

  const copy = async (value: string, successMsg: string = '复制成功') => {
    if (!value) {
      Message.warning('复制内容不能为空');
      return;
    }
    await clipboardCopy(value);
    Message.success(successMsg);
  };

  const debugCopy = (value: string, successMsg: string = '复制成功') => {
    if (!userInfo.isSuperManager) {
      return;
    }
    copy(value, successMsg);
  };

  return {
    copy,
    debugCopy,
  };
}
