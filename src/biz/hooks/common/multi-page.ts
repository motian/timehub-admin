import { ArgPage } from '@/api/common';
import BaseModel from '@/biz/model-base/common/base-model';
import MultiPage from '@/biz/model-base/common/multi-page';
import HJson from '@/biz/model-base/h-json';
import { Message } from '@arco-design/web-vue';
import { cloneDeep, isArray } from 'lodash-es';
import { ref, UnwrapRef } from 'vue';

export interface OnAfterAction {
  (): void;
}

interface ItemEditorModal<T> {
  show: boolean;
  form: T;
  title: string;
  extra?: any;
}

export default function useMultiPageData<T extends BaseModel>(
  api: any,
  Type: {
    new (item?: any): any;
  }
) {
  const loading = ref({
    page: false,
    detail: false,
  });
  const detail = ref<T>(new Type());
  const pageData = ref(new MultiPage<T>(Type));
  const allData = ref<T[]>([]);
  const queryParams = ref<any>({});
  // 创建/编辑弹窗
  const formModal = ref<ItemEditorModal<T>>({
    show: false,
    form: new Type(),
    title: '',
  });
  const detailModal = ref({
    show: false,
    id: 0,
  });

  async function getPageData(params: ArgPage) {
    const arg = {
      ...params,
      ...queryParams.value,
    };
    if (!arg.pageSize) arg.pageSize = arg.page ? 20 : 1000;
    if (!arg.page) arg.page = 1;
    const { data } = await api.GetList(arg);
    return MultiPage.fromJson(data, Type);
  }

  async function loadPageData(params: ArgPage) {
    loading.value.page = true;
    Object.keys(params).forEach((key) => {
      if (!['page', 'pageSize'].includes(key)) {
        queryParams.value[key] = (params as any)[key];
      }
    });
    pageData.value = await getPageData(params);
    pageData.value.setDataFunc(loadPageData);
    loading.value.page = false;
    return pageData.value;
  }

  function loadCurrentPageData() {
    const { current, pageSize } = pageData.value.pagination;
    return loadPageData({ page: current, pageSize });
  }

  function loadFirstPageData(pageSize = 0) {
    const { pagination } = pageData.value;
    const defaultPageSize = 20; // 首次加载第一页且未指定分页大小时的默认值
    return loadPageData({
      page: 1,
      pageSize: pageSize || pagination.pageSize || defaultPageSize,
    });
  }

  async function loadAllData(params: any = {}) {
    loading.value.page = true;
    const { data } = await api.GetList({
      page: 1,
      pageSize: 5000,
      ...params,
    });
    const arrData = isArray(data.list) ? data.list : data;
    allData.value = HJson.fromJsonArray(arrData, Type);
    loading.value.page = false;
    return allData.value;
  }

  async function loadDetail(id: number, extra = {}, clearFirst = true) {
    loading.value.detail = true;
    if (id > 0 || Object.keys(extra || {}).length > 0) {
      if (clearFirst) {
        detail.value = HJson.fromJson(null, Type);
      }
      const { data } = await api.Detail({ id, ...extra });
      detail.value = HJson.fromJson(data, Type);
    } else {
      detail.value = new Type();
    }
    loading.value.detail = false;
    return detail.value;
  }

  function onFormModal(title = '', itemData: T | null = null) {
    formModal.value.show = true;
    formModal.value.title = itemData ? `编辑${title}` : `添加${title}`;
    if (!itemData) {
      formModal.value.form = new Type();
    } else {
      formModal.value.form = cloneDeep(itemData) as UnwrapRef<T>;
    }
  }

  function onDetailModal(id: number) {
    detailModal.value.show = true;
    detailModal.value.id = id;
  }

  async function saveData(
    data: T | null = null,
    callback: OnAfterAction | null = null
  ) {
    try {
      const postData: any = data || detail.value;
      if (!postData?.id) {
        const res = await api.Create(postData);
        postData.id = res.data?.id ?? 0;
      } else {
        await api.Update(postData);
      }
      formModal.value.show = false;
      Message.success('保存成功');
      if (callback) {
        callback();
      }
    } catch {
      return false;
    }
    return true;
  }

  async function deleteData(id: number, callback: OnAfterAction | null = null) {
    await api.Delete({ id });
    Message.success('删除成功');
    if (callback) {
      callback();
    }
  }

  return {
    queryParams,
    detail,
    pageData,
    allData,
    formModal,
    detailModal,
    loading,
    onFormModal,
    onDetailModal,
    getPageData,
    loadCurrentPageData,
    loadFirstPageData,
    loadPageData,
    loadAllData,
    loadDetail,
    deleteData,
    saveData,
  };
}
