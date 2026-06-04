import { API } from '@/api';
import MSight from '@/biz/model/sight/sight';
import MMedia from '@/biz/model/media/media';
import { Message } from '@arco-design/web-vue';
import useMultiPageData from '../common/multi-page';

const MEDIA_TYPE_SIGHT = 'sight';

export default function useSightApi() {
  const sightApi = useMultiPageData<MSight>(API.Sight, MSight);

  const syncSightImages = async (
    sightId: number,
    images: MMedia[],
    originalImageIds: number[]
  ) => {
    const currentIds = images
      .filter((item) => item.id > 0)
      .map((item) => item.id);
    const deletedIds = originalImageIds.filter(
      (id) => !currentIds.includes(id)
    );
    const newMedias = images.filter((item) => !item.id && item.key);

    if (deletedIds.length) {
      await API.Media.BatchDelete({
        type: MEDIA_TYPE_SIGHT,
        bizId: sightId,
        ids: deletedIds,
      });
    }
    if (newMedias.length) {
      await API.Media.BatchCreate({
        type: MEDIA_TYPE_SIGHT,
        bizId: sightId,
        medias: newMedias.map((item, index) => {
          item.sort = index + 1;
          return item;
        }),
      });
    }
    const sortChanged = images.some(
      (item, index) => item.id > 0 && item.sort !== index + 1
    );
    if (sortChanged && images.some((item) => item.id > 0)) {
      await API.Media.UpdateSort({
        type: MEDIA_TYPE_SIGHT,
        data: images
          .filter((item) => item.id > 0)
          .map((item, index) => ({ id: item.id, sort: index + 1 })),
      });
    }
  };

  const saveSight = async (sight: MSight, originalImageIds: number[] = []) => {
    const payload = sight.toSubmit();
    let sightId = sight.id;

    if (!sightId) {
      const { data } = await API.Sight.Create(payload);
      sightId = data?.id ?? 0;
    } else {
      await API.Sight.Update(payload);
    }

    if (sightId) {
      await syncSightImages(sightId, sight.images || [], originalImageIds);
    }

    Message.success('保存成功');
    return sightId;
  };

  return {
    ...sightApi,
    saveSight,
    syncSightImages,
  };
}
