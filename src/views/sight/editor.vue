<script setup lang="ts">
  import useSightApi from '@/biz/hooks/sight/sight';
  import useSightSectionApi from '@/biz/hooks/sight/sight-section';
  import MSightSection from '@/biz/model/sight/sight-section';
  import useScreenSize from '@/biz/hooks/common/screen';
  import { Message } from '@arco-design/web-vue';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import getFormConfig from './hooks/form-config';

  const route = useRoute();
  const router = useRouter();
  const argId = Number(route.query.id ?? 0);
  const { sidebarWidth } = useScreenSize();
  const formRef = ref();
  const originalImageIds = ref<number[]>([]);
  const sectionOptions = ref<MSightSection[]>([]);
  const { detail: formData, loadDetail, saveSight } = useSightApi();
  const { loadAllData: loadSectionOptions } = useSightSectionApi();
  const formConfig = getFormConfig(formData);

  const sectionSelectOptions = computed(() =>
    sectionOptions.value.map((item) => ({
      label: item.name,
      value: item.id,
    }))
  );

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
    await saveSight(formData.value, originalImageIds.value);
    router.replace({ name: 'SightList' });
  };

  onMounted(async () => {
    sectionOptions.value = await loadSectionOptions();
    await loadDetail(argId);
    originalImageIds.value = (formData.value.images || [])
      .filter((item) => item.id > 0)
      .map((item) => item.id);
  });
</script>

<template>
  <div class="container sight-editor">
    <h-form
      ref="formRef"
      v-model="formData"
      class="form"
      size="small"
      :config="formConfig"
      hide-group-title
    >
      <template #sectionIds="{ formItem }">
        <a-form-item
          label="所属栏目"
          field="sectionIds"
          :rules="formItem.rules"
        >
          <a-select
            v-model="formData.sectionIds"
            multiple
            allow-clear
            placeholder="请选择所属栏目"
            :options="sectionSelectOptions"
          />
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
            建议尺寸 750×368，大小不超过 10M，支持 JPG/PNG 格式
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
        <a-form-item field="content" label="市集详情">
          <h-editor v-model="formData.content" />
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

    /* 开放日期仅选月日：弹层挂在本页容器内，隐藏标题中的年份与分隔符 */
    &.sight-editor :deep(.arco-picker-header-title > span:nth-child(1)),
    &.sight-editor :deep(.arco-picker-header-title > span:nth-child(2)) {
      display: none;
    }

    .form {
      margin: 15px 0;
      padding: 30px 30px 80px;
      background-color: white;
    }

    .cover-field {
      display: flex;
      flex-direction: column;
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
