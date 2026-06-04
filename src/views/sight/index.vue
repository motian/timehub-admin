<script setup lang="ts">
  import { SightFeeType } from '@/biz/const/sight';
  import useSightApi from '@/biz/hooks/sight/sight';
  import useSightSectionApi from '@/biz/hooks/sight/sight-section';
  import MSight from '@/biz/model/sight/sight';
  import MSightSection from '@/biz/model/sight/sight-section';
  import { Modal } from '@arco-design/web-vue';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const sectionOptions = ref<MSightSection[]>([]);
  const {
    queryParams,
    pageData,
    loadFirstPageData,
    loadCurrentPageData,
    deleteData,
  } = useSightApi();
  const { loadAllData: loadSectionOptions } = useSightSectionApi();

  const sectionNameMap = computed(() => {
    const map: Record<number, string> = {};
    sectionOptions.value.forEach((item) => {
      map[item.id] = item.name;
    });
    return map;
  });

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '封面', slotName: 'cover', width: 100 },
    { title: '名称', dataIndex: 'title', width: 160 },
    { title: '标签', dataIndex: 'tag', width: 100 },
    { title: '短地址', dataIndex: 'shortAddress', width: 140 },
    { title: '栏目', slotName: 'sections', width: 140 },
    { title: '门票', slotName: 'ticketPrice', width: 90 },
    { title: '开放时间', dataIndex: 'openTimeDesc', width: 160 },
    { title: '操作', slotName: 'operation', width: 120 },
  ];

  const formatPrice = (record: MSight) => {
    if (record.feeType === SightFeeType.FREE) return '免费';
    return `¥${Number(record.ticketPrice).toFixed(2)}`;
  };

  const formatSections = (record: MSight) => {
    const ids = record.sectionIds || [];
    if (!ids.length) return '/';
    return ids.map((id) => sectionNameMap.value[id] || `#${id}`).join('、');
  };

  const gotoEdit = (record: MSight | null = null) => {
    router.push({
      name: 'SightEditor',
      query: {
        id: String(record?.id || 0),
        locale: record?.id ? '编辑市集' : '添加市集',
      },
    });
  };

  const onDelete = (sight: MSight) => {
    Modal.confirm({
      title: '删除市集',
      content: `确定删除「${sight.title}」？删除后不可恢复`,
      okButtonProps: { status: 'danger' },
      onOk: async () => {
        await deleteData(sight.id);
        loadCurrentPageData();
      },
    });
  };

  const onReset = () => {
    queryParams.value.sectionId = 0;
    queryParams.value.title = '';
    loadFirstPageData();
  };

  onMounted(async () => {
    sectionOptions.value = await loadSectionOptions();
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
            <a-form-item field="sectionId" label="栏目">
              <h-select
                v-model="queryParams.sectionId"
                allow-clear
                :empty-value="0"
                style="width: 200px"
                :options="[
                  { label: '全部栏目', value: 0 },
                  ...sectionOptions.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })),
                ]"
                placeholder="全部栏目"
                @change="loadFirstPageData()"
              />
            </a-form-item>
            <a-form-item field="title" label="关键词">
              <a-input
                v-model.trim="queryParams.title"
                style="width: 300px"
                placeholder="请输入市集名称"
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
        <div>市集列表</div>
        <a-button type="primary" size="small" @click="gotoEdit()">
          添加市集
        </a-button>
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
      <template #sections="{ record }">
        {{ formatSections(record) }}
      </template>
      <template #ticketPrice="{ record }">
        {{ formatPrice(record) }}
      </template>
      <template #operation="{ record }">
        <div class="h-tb-btn">
          <a-button size="small" type="text" @click="gotoEdit(record)">
            编辑
          </a-button>
        </div>
        <div class="h-tb-btn">
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
