import { API } from '@/api';
import MSightSection from '@/biz/model/sight/sight-section';
import { Message } from '@arco-design/web-vue';
import useMultiPageData from '../common/multi-page';

export default function useSightSectionApi() {
  const sectionApi = useMultiPageData<MSightSection>(
    API.SightSection,
    MSightSection
  );

  const saveSection = async (section: MSightSection) => {
    const payload = section.toSubmit();
    if (!section.id) {
      await API.SightSection.Create(payload);
    } else {
      await API.SightSection.Update(payload);
    }
    Message.success('保存成功');
  };

  return {
    ...sectionApi,
    saveSection,
  };
}
