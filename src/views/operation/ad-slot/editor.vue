<script setup lang="ts">
  import { ArticleStatus } from '@/biz/const/article';
  import {
    AdSlotRedirectType,
    AdSlotType,
    type AdSlotVideoRedirectData,
  } from '@/biz/const/ad-slot';
  import useArticleApi from '@/biz/hooks/article/article';
  import useAdSlotApi from '@/biz/hooks/operation/ad-slot';
  import MArticle from '@/biz/model/article/article';
  import useScreenSize from '@/biz/hooks/common/screen';
  import { Message } from '@arco-design/web-vue';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import getFormConfig from './hooks/form-config';

  const route = useRoute();
  const router = useRouter();
  const argId = Number(route.query.id ?? 0);
  const { sidebarWidth } = useScreenSize();
  const formRef = ref();
  const formReady = ref(false);
  const articleOptions = ref<MArticle[]>([]);
  const createEmptyVideo = (): AdSlotVideoRedirectData => ({
    finderUserName: '',
    feedId: '',
  });
  const video = ref<AdSlotVideoRedirectData>(createEmptyVideo());
  const { detail: formData, loadDetail, saveAdSlot } = useAdSlotApi();
  const { loadAllData: loadArticleOptions, loadDetail: loadArticleDetail } =
    useArticleApi();
  const formConfig = getFormConfig();

  const selectedArticleId = computed({
    get: () => {
      const id = Number(formData.value.redirectData);
      return Number.isFinite(id) && id > 0 ? id : undefined;
    },
    set: (id: number | undefined) => {
      formData.value.redirectData = id ? String(id) : '';
    },
  });

  const redirectDataRules = computed(() => {
    const { redirectType } = formData.value;
    if (redirectType === AdSlotRedirectType.ARTICLE) {
      return [{ required: true, message: '请选择文章' }];
    }
    if (redirectType === AdSlotRedirectType.OFFICIAL_ACCOUNT) {
      return [{ required: true, message: '请输入公众号链接' }];
    }
    if (redirectType === AdSlotRedirectType.VIDEO_CHANNEL) {
      return [
        {
          validator: (_value: string, callback: (msg?: string) => void) => {
            if (!video.value.finderUserName.trim()) {
              callback('请输入视频号 ID');
              return;
            }
            if (!video.value.feedId.trim()) {
              callback('请输入视频 ID');
              return;
            }
            callback();
          },
        },
      ];
    }
    return [{ required: true, message: '请配置跳转' }];
  });

  const syncVideoFieldsFromRedirectData = () => {
    if (formData.value.redirectType !== AdSlotRedirectType.VIDEO_CHANNEL) {
      video.value = createEmptyVideo();
      return;
    }
    try {
      const data = JSON.parse(
        formData.value.redirectData || '{}'
      ) as AdSlotVideoRedirectData;
      video.value = {
        finderUserName: data.finderUserName || '',
        feedId: data.feedId || '',
      };
    } catch {
      video.value = createEmptyVideo();
    }
  };

  const buildRedirectDataForSave = () => {
    if (formData.value.redirectType === AdSlotRedirectType.VIDEO_CHANNEL) {
      formData.value.redirectData = JSON.stringify({
        finderUserName: video.value.finderUserName.trim(),
        feedId: video.value.feedId.trim(),
      });
    }
  };

  const onRedirectTypeChange = () => {
    formData.value.redirectData = '';
    video.value = createEmptyVideo();
  };

  watch(
    () => formData.value.redirectType,
    (value, oldValue) => {
      if (!formReady.value || value === oldValue) {
        return;
      }
      onRedirectTypeChange();
    }
  );

  const ensureArticleOption = async () => {
    if (formData.value.redirectType !== AdSlotRedirectType.ARTICLE) {
      return;
    }
    const articleId = Number(formData.value.redirectData);
    if (
      !articleId ||
      articleOptions.value.some((item) => item.id === articleId)
    ) {
      return;
    }
    const article = await loadArticleDetail(articleId);
    if (article?.id) {
      articleOptions.value = [article, ...articleOptions.value];
    }
  };

  const onCoverUpload = (_: unknown, res: { url: string }) => {
    formData.value.cover = res.url;
    formRef.value.getFormRef()?.validateField('cover');
  };

  const onSaveData = async () => {
    buildRedirectDataForSave();
    const errors = await formRef.value?.getFormRef()?.validate();
    if (errors) {
      const key = Object.keys(errors)?.[0];
      Message.warning(errors?.[key]?.message);
      return;
    }
    await saveAdSlot(formData.value);
    router.replace({ name: 'AdSlotList' });
  };

  onMounted(async () => {
    articleOptions.value = await loadArticleOptions({
      status: ArticleStatus.ACTIVE,
    });
    await loadDetail(argId);
    if (!argId) {
      formData.value.type = AdSlotType.IMAGE;
    }
    syncVideoFieldsFromRedirectData();
    await ensureArticleOption();
    formReady.value = true;
  });
</script>

<template>
  <div class="container">
    <h-form
      ref="formRef"
      v-model="formData"
      class="form"
      size="small"
      :config="formConfig"
      hide-group-title
    >
      <template #redirectData>
        <a-form-item
          label="跳转配置"
          field="redirectData"
          :rules="redirectDataRules"
          required
        >
          <a-select
            v-if="formData.redirectType === AdSlotRedirectType.ARTICLE"
            v-model="selectedArticleId"
            allow-search
            placeholder="请选择文章"
          >
            <a-option
              v-for="article in articleOptions"
              :key="article.id"
              :value="article.id"
              :label="article.title"
            >
              <div class="article-option">
                <a-image
                  v-if="article.cover"
                  :src="article.cover"
                  width="48"
                  height="28"
                  fit="cover"
                  class="wm-r-8"
                />
                <span class="article-option__title">{{ article.title }}</span>
              </div>
            </a-option>
          </a-select>

          <a-input
            v-else-if="
              formData.redirectType === AdSlotRedirectType.OFFICIAL_ACCOUNT
            "
            v-model.trim="formData.redirectData"
            placeholder="请输入公众号链接"
            allow-clear
          />

          <div
            v-else-if="
              formData.redirectType === AdSlotRedirectType.VIDEO_CHANNEL
            "
            class="video-redirect"
          >
            <a-input
              v-model.trim="video.finderUserName"
              placeholder="视频号 ID"
              allow-clear
            />
            <a-input
              v-model.trim="video.feedId"
              class="wm-t-10"
              placeholder="视频 ID"
              allow-clear
            />
          </div>
        </a-form-item>
      </template>
      <template #cover="{ formItem }">
        <a-form-item
          label="封面图"
          field="cover"
          :rules="formItem.rules"
          validate-trigger="blur"
        >
          <div class="cover-field">
            <h-media-upload
              :media-list="formData.cover ? [{ url: formData.cover }] : []"
              :limit="1"
              :max-size="10"
              :width="150"
              :height="74"
              accept="image/jpg,image/jpeg,image/png"
              @upload="onCoverUpload"
              @remove="() => (formData.cover = '')"
            />
          </div>
          <template #extra>
            建议上传首页展示图，大小不超过 10M，支持 JPG/PNG 格式
          </template>
        </a-form-item>
      </template>
    </h-form>
    <div class="footer" :style="{ left: `${sidebarWidth}px` }">
      <a-button type="primary" class="wm-r-10" @click="onSaveData">
        <span v-if="!argId">确认保存</span>
        <span v-else>确认修改</span>
      </a-button>
      <a-button @click="router.back()">取消</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .container {
    width: 80%;
    max-width: 1000px;
    height: 100vh;
    margin: 0 auto;

    .form {
      margin: 15px 0;
      padding: 30px 30px 80px;
      background-color: white;
    }

    .cover-field {
      display: flex;
      flex-direction: column;
    }

    .article-option {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 4px 0;

      &__title {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .video-redirect {
      width: 100%;
    }
  }

  .footer {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 56px;
    background: var(--color-bg-2);
    border-top: 1px solid var(--color-border);
  }
</style>
