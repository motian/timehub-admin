import { API } from '@/api';
import MProduct from '@/biz/model/product/product';
import MMedia from '@/biz/model/media/media';
import { Message } from '@arco-design/web-vue';
import useMultiPageData from '../common/multi-page';

const MEDIA_TYPE_PRODUCT = 'product';

export default function useProductApi() {
  const productApi = useMultiPageData<MProduct>(API.Product, MProduct);

  const updateStatus = async (record: MProduct) => {
    const status = record.status === 1 ? 2 : 1;
    await API.Product.UpdateStatus({ id: record.id, status });
    Message.success(status === 1 ? '上架成功' : '下架成功');
  };

  const cancelActivity = async (record: MProduct, remark = '') => {
    await API.Product.CancelActivity({ productId: record.id, remark });
    Message.success('活动已取消，相关订单将自动处理退款');
  };

  const syncProductImages = async (
    productId: number,
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
        type: MEDIA_TYPE_PRODUCT,
        bizId: productId,
        ids: deletedIds,
      });
    }
    if (newMedias.length) {
      await API.Media.BatchCreate({
        type: MEDIA_TYPE_PRODUCT,
        bizId: productId,
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
        type: MEDIA_TYPE_PRODUCT,
        data: images
          .filter((item) => item.id > 0)
          .map((item, index) => ({ id: item.id, sort: index + 1 })),
      });
    }
  };

  const saveProduct = async (
    product: MProduct,
    originalImageIds: number[] = []
  ) => {
    const payload = product.toSubmit();
    let productId = product.id;

    if (!productId) {
      const { data } = await API.Product.Create(payload);
      productId = data?.id ?? 0;
    } else {
      await API.Product.Update(payload);
    }

    if (productId) {
      await syncProductImages(
        productId,
        product.images || [],
        originalImageIds
      );
    }

    Message.success('保存成功');
    return productId;
  };

  return {
    ...productApi,
    updateStatus,
    cancelActivity,
    saveProduct,
    syncProductImages,
  };
}
