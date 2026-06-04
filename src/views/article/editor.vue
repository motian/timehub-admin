<script setup lang="ts">
  import { needsCarouselImages } from '@/biz/const/article';
  import useArticleApi from '@/biz/hooks/article/article';
  import useScreenSize from '@/biz/hooks/common/screen';
  import { Message } from '@arco-design/web-vue';
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import getFormConfig from './hooks/form-config';

  const route = useRoute();
  const router = useRouter();
  const argId = Number(route.query.id ?? 0);
  const { sidebarWidth } = useScreenSize();
  const formRef = ref();
  const originalImageIds = ref<number[]>([]);
  const { detail: formData, loadDetail, saveArticle } = useArticleApi();
  const formConfig = getFormConfig(formData);

  const onCoverUpload = (_: unknown, res: { url: string }) => {
    formData.value.cover = res.url;
    formRef.value.getFormRef()?.validateField('cover');
  };

  const onSaveData = async () => {
    const errors = await formRef.value?.getFormRef()?.validate();
    if (errors) {
      const key = Object.keys(errors)?.[0];
      Message.warning(errors?.[key]?.message);
      return;
    }
    await saveArticle(formData.value, originalImageIds.value);
    router.replace({ name: 'ArticleList' });
  };

  onMounted(async () => {
    await loadDetail(argId);
    if (needsCarouselImages(formData.value.type)) {
      originalImageIds.value = (formData.value.images || [])
        .filter((item) => item.id > 0)
        .map((item) => item.id);
    }
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
      :auto-label-width="false"
      hide-group-title
    >
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
              :width="100"
              :height="143"
              accept="image/jpg,image/jpeg,image/png"
              @upload="onCoverUpload"
              @remove="() => (formData.cover = '')"
            />
          </div>
          <template #extra>
            建议尺寸 375×535，大小不超过 10M，支持 JPG/PNG 格式
          </template>
        </a-form-item>
      </template>
      <template #images>
        <a-form-item label="轮播图片" field="images">
          <h-media-upload
            v-model:media-list="formData.images"
            :limit="20"
            :max-size="10"
            accept="image/jpg,image/jpeg,image/png"
          />
          <template #extra>
            最多上传 20 张，单图大小不超过 10M，支持 JPG/PNG 格式
          </template>
        </a-form-item>
      </template>
      <template #content>
        <a-form-item
          v-if="formData.type === 2"
          field="content"
          label="公众号链接"
          required
        >
          <a-input
            v-model.trim="formData.content"
            placeholder="请输入公众号文章链接"
          />
        </a-form-item>
        <a-form-item v-else field="content" label="正文" required>
          <h-editor v-model="formData.content" />
        </a-form-item>
      </template>
    </h-form>
    <div class="footer" :style="{ left: `${sidebarWidth}px` }">
      <a-button type="primary" class="wm-r-10" @click="onSaveData">
        <span v-if="!argId">确认发布</span>
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
      gap: 12px;
      width: 100%;
    }

    .cover-input {
      max-width: 480px;
    }

    .footer {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      background: white;
      border-top: solid 1px @color-border-2;
    }
  }
</style>
