<script setup lang="ts">
  import {
    ARTICLE_STATUS_OPTIONS,
    ARTICLE_TYPE_ALL_OPTIONS,
    ARTICLE_TYPE_OPTIONS,
    ArticleStatus,
  } from '@/biz/const/article';
  import useArticleApi from '@/biz/hooks/article/article';
  import MArticle from '@/biz/model/article/article';
  import { Modal } from '@arco-design/web-vue';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const {
    queryParams,
    pageData,
    updateStatus,
    loadFirstPageData,
    loadCurrentPageData,
    deleteData,
  } = useArticleApi();

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '封面图', slotName: 'cover', width: 100 },
    { title: '标题', dataIndex: 'title', width: 180 },
    { title: '类型', slotName: 'type', width: 200 },
    { title: '创建人', dataIndex: 'creator.name', width: 100 },
    { title: '创建时间', dataIndex: 'createdAt', width: 160 },
    { title: '生效时间', slotName: 'publishAt', width: 160 },
    { title: '浏览量', dataIndex: 'viewCount', width: 80 },
    { title: '状态', slotName: 'status', width: 90 },
    { title: '操作', slotName: 'operation', width: 140 },
  ];

  const gotoEdit = (record: MArticle | null = null) => {
    router.push({
      name: 'ArticleEditor',
      query: {
        id: String(record?.id || 0),
        locale: record?.id ? '编辑文章' : '添加文章',
      },
    });
  };

  const gotoPreview = (article: MArticle) => {
    if (article.url) {
      window.open(article.url, '_blank');
    }
  };

  const onDelete = (article: MArticle) => {
    Modal.confirm({
      title: '删除文章',
      content: `确定删除「${article.title}」？删除后不可恢复`,
      okButtonProps: { status: 'danger' },
      onOk: async () => {
        await deleteData(article.id);
        loadCurrentPageData();
      },
    });
  };

  const onUpdateStatus = (article: MArticle) => {
    const action = article.status === ArticleStatus.ACTIVE ? '下架' : '上架';
    Modal.confirm({
      title: `${action}文章`,
      content: `确定${action}「${article.title}」吗？`,
      okButtonProps: {
        status: article.status === ArticleStatus.ACTIVE ? 'danger' : 'normal',
      },
      onOk: async () => {
        await updateStatus(article);
        loadCurrentPageData();
      },
    });
  };

  const onReset = () => {
    queryParams.value.status = 0;
    queryParams.value.type = 0;
    queryParams.value.title = '';
    loadFirstPageData();
  };

  onMounted(() => {
    loadFirstPageData();
  });
</script>

<template>
  <div class="content">
    <div class="h-search-card">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="queryParams"
            auto-label-width
            label-align="left"
            layout="inline"
            size="small"
          >
            <a-form-item field="type" label="类型">
              <h-select
                v-model="queryParams.type"
                allow-clear
                :empty-value="0"
                style="width: 200px"
                :options="ARTICLE_TYPE_OPTIONS"
                placeholder="请选择文章类型"
                @change="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="status" label="状态">
              <h-select
                v-model="queryParams.status"
                allow-clear
                :empty-value="0"
                style="width: 160px"
                :options="ARTICLE_STATUS_OPTIONS"
                placeholder="请选择文章状态"
                @change="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="title" label="关键词">
              <a-input
                v-model.trim="queryParams.title"
                style="width: 300px"
                search-button
                placeholder="请输入文章标题关键词"
                allow-clear
                @press-enter="loadFirstPageData()"
                @clear="loadFirstPageData()"
              />
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :flex="'200px'" style="text-align: right">
          <a-space>
            <a-button type="primary" size="small" @click="loadFirstPageData()">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button size="small" @click="onReset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <h-table :page-data="pageData" :columns="columns">
      <template #header>
        <div>拾光圈列表</div>
        <a-button type="primary" size="small" @click="gotoEdit()">
          添加文章
        </a-button>
      </template>
      <template #type="{ record }">
        {{
          ARTICLE_TYPE_ALL_OPTIONS.find((item) => item.value === record.type)
            ?.label || record.type
        }}
      </template>
      <template #cover="{ record }">
        <a-image
          v-if="record.cover"
          :src="record.cover"
          width="100"
          height="56"
        />
        <span v-else>/</span>
      </template>
      <template #publishAt="{ record }">
        {{ record.publishAt || '/' }}
      </template>
      <template #status="{ record }">
        <a-tag
          v-if="record.status === ArticleStatus.ACTIVE"
          color="#168cff"
          bordered
        >
          上架中
        </a-tag>
        <a-tag
          v-else-if="record.status === ArticleStatus.INACTIVE"
          color="#86909c"
          bordered
        >
          已下架
        </a-tag>
        <a-tag
          v-else-if="record.status === ArticleStatus.PENDING"
          color="#f53f3f"
          bordered
        >
          待生效
        </a-tag>
      </template>
      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button
            v-if="record.url"
            size="small"
            type="text"
            @click="gotoPreview(record)"
          >
            查看
          </a-button>
          <a-divider v-if="record.url" direction="vertical" :margin="0" />
          <a-button size="small" type="text" @click="gotoEdit(record)">
            编辑
          </a-button>
        </div>
        <div class="h-tb-btn">
          <a-button
            size="small"
            type="text"
            :status="
              record.status === ArticleStatus.ACTIVE ? 'danger' : 'normal'
            "
            :disabled="record.status === ArticleStatus.PENDING"
            @click="onUpdateStatus(record)"
          >
            {{ record.status === ArticleStatus.ACTIVE ? '下架' : '上架' }}
          </a-button>
          <a-divider direction="vertical" :margin="0" />
          <a-button
            size="small"
            type="text"
            status="danger"
            @click="onDelete(record)"
          >
            删除
          </a-button>
        </div>
      </template>
    </h-table>
  </div>
</template>

<style lang="less" scoped>
  .content {
    margin: -1px auto 0;
  }
</style>
