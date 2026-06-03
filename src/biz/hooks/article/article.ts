import { API } from '@/api';
import MArticle from '@/biz/model/article/article';
import MMedia from '@/biz/model/media/media';
import { needsCarouselImages } from '@/biz/const/article';
import { Message } from '@arco-design/web-vue';
import useMultiPageData from '../common/multi-page';

const MEDIA_TYPE_ARTICLE = 'article';

function toMediaPayload(item: MMedia, sort: number) {
  return {
    mimeType: item.mimeType,
    name: item.name,
    width: item.width,
    height: item.height,
    size: item.size,
    key: item.key,
    hash: item.hash,
    sort,
  };
}

export default function useArticleApi() {
  const articleApi = useMultiPageData<MArticle>(API.Article, MArticle);

  const updateStatus = async (record: MArticle) => {
    const status = record.status === 1 ? 2 : 1;
    await API.Article.UpdateStatus({ id: record.id, status });
    Message.success(status === 1 ? '上架成功' : '下架成功');
  };

  const syncArticleImages = async (
    articleId: number,
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
        type: MEDIA_TYPE_ARTICLE,
        bizId: articleId,
        ids: deletedIds,
      });
    }
    if (newMedias.length) {
      await API.Media.BatchCreate({
        type: MEDIA_TYPE_ARTICLE,
        bizId: articleId,
        medias: newMedias.map((item, index) => toMediaPayload(item, index + 1)),
      });
    }
    const sortChanged = images.some(
      (item, index) => item.id > 0 && item.sort !== index + 1
    );
    if (sortChanged && images.some((item) => item.id > 0)) {
      await API.Media.UpdateSort({
        type: MEDIA_TYPE_ARTICLE,
        data: images
          .filter((item) => item.id > 0)
          .map((item, index) => ({ id: item.id, sort: index + 1 })),
      });
    }
  };

  const saveArticle = async (
    article: MArticle,
    originalImageIds: number[] = []
  ) => {
    const payload = article.toSubmit();
    let articleId = article.id;

    if (!articleId) {
      const { data } = await API.Article.Create(payload);
      articleId = data?.id ?? 0;
    } else {
      await API.Article.Update(payload);
    }

    if (articleId && needsCarouselImages(article.type)) {
      await syncArticleImages(
        articleId,
        article.images || [],
        originalImageIds
      );
    }

    Message.success('保存成功');
    return articleId;
  };

  return {
    ...articleApi,
    updateStatus,
    saveArticle,
    syncArticleImages,
  };
}
