<script setup lang="ts">
  import useScreenSize from '@/biz/hooks/common/screen';
  import { getFormatValue } from '@/biz/model-base/decorator/metada';
  import { PaginationProps, TableColumnData } from '@arco-design/web-vue';
  import { isBoolean } from 'lodash-es';
  import { computed, PropType } from 'vue';

  type getTableDataFunc = (params: { page: number; pageSize: number }) => void;

  interface PageData {
    list: any[];
    pagination: {
      current: number;
      pageSize: number;
      total: number;
      getTableData?: getTableDataFunc;
    };
  }

  const props = defineProps({
    pagination: {
      type: [Object, Boolean] as PropType<PaginationProps | boolean>,
      default: () => true,
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    pageData: {
      type: [Object, Boolean] as PropType<PageData>,
    },
    columns: {
      type: Array as PropType<TableColumnData[]>,
      default: () => [],
    },
    autoFormat: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    reverse: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    rowKey: {
      type: String as PropType<string>,
      default: 'id',
    },
    fixedPagination: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    paginationOffset: {
      type: Number as PropType<number>,
      default: 0,
    },
  });
  const emit = defineEmits([
    'onPageChange',
    'onPageSizeChange',
    'sorterChange',
  ]);

  /** 还原 autoFormat 时列 dataIndex 的 @ 格式为点号路径，供排序等回调使用 */
  function normalizeDataIndex(dataIndex: string) {
    return dataIndex.replace(/^@/, '').replace(/@/g, '.');
  }

  const onSorterChange = (dataIndex: string, direction: string) => {
    emit('sorterChange', normalizeDataIndex(dataIndex), direction);
  };

  const { sidebarWidth } = useScreenSize();
  const sidebarleft = computed(() => {
    return `${sidebarWidth.value + props.paginationOffset}px`;
  });

  const argData = computed(() => {
    return props.pageData ? props.pageData.list : props.data;
  });

  const argPagination = computed(() => {
    const pagination = props.pageData
      ? props.pageData.pagination
      : props.pagination;
    if (isBoolean(pagination)) {
      if (pagination) {
        // 翻页未指定分页参数
        return { current: 1, pageSize: 20 };
      }
      // 不分页
      return { current: 1, pageSize: 0 };
    }
    return {
      ...pagination,
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 15,
      pageSizeOptions: [20, 50, 100, 200],
      size: 'small',
      showPageSize: true,
      showTotal: true,
    };
  });

  const tableColumns = computed(() => {
    if (!props.autoFormat) {
      return props.columns;
    }
    return props.columns.map((column) => {
      return {
        ...column,
        dataIndex: `@${column.dataIndex?.replace(/\./g, '@')}`,
      };
    });
  });

  const tableData = computed(() => {
    if (!props.autoFormat) {
      if (props.reverse) {
        return argData.value.slice().reverse();
      }
      return argData.value;
    }
    const list = argData.value;
    const { current, pageSize } = argPagination.value;
    list.forEach((rowItem: any, index: number) => {
      rowItem['@index'] = (current - 1) * pageSize + index + 1;
      props.columns.forEach((column) => {
        const key = column.dataIndex;
        if (key) {
          const newKey = `@${key?.replace(/\./g, '@')}`;
          const value = getFormatValue(rowItem, key);
          rowItem[newKey] = value;
        }
      });
    });
    if (props.reverse) {
      return list.reverse();
    }
    return list;
  });

  const onPageChange = (current: number) => {
    if (!props.pageData) {
      emit('onPageChange', current);
      return;
    }
    const { pagination } = props.pageData;
    if (!pagination.getTableData || current === pagination.current) {
      emit('onPageChange', current);
      return;
    }
    pagination?.getTableData({
      page: current,
      pageSize: pagination.pageSize,
    });
  };

  const onPageSizeChange = (pageSize: number) => {
    if (!props.pageData) {
      emit('onPageSizeChange', pageSize);
      return;
    }
    const { pagination } = props.pageData;
    if (!pagination.getTableData || pageSize === pagination.pageSize) {
      emit('onPageSizeChange', pageSize);
      return;
    }
    pagination?.getTableData({
      page: pagination.current,
      pageSize,
    });
  };
</script>

<template>
  <div class="table-container">
    <div v-if="$slots.header" class="header">
      <slot name="header"></slot>
    </div>
    <a-table
      :class="{ 'table-fixed': fixedPagination }"
      :data="tableData"
      :columns="tableColumns"
      :row-key="rowKey"
      :pagination="argPagination.pageSize > 0 ? argPagination : false"
      v-bind="$attrs"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      @sorter-change="onSorterChange"
    >
      <template v-for="item in Object.keys($slots)" #[item]="itemData">
        <slot v-if="itemData" :name="item" v-bind="itemData"> </slot>
        <slot v-else :name="item"> </slot>
      </template>
      <template #pagination-right>
        <div class="wm-r-20"></div>
      </template>
    </a-table>
  </div>
</template>

<style lang="less">
  .arco-table-size-mini {
    .arco-table-th {
      padding: 5px 0;
    }
  }
</style>

<style lang="less" scoped>
  .table-container {
    padding-bottom: 36px;
    background-color: white;

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 15px;
      overflow: hidden;
      font-weight: 600;
      font-size: 15px;
      background-color: white;
      border: solid 1px @color-border-2;
      border-bottom-width: 0;
    }

    .table-fixed {
      margin-bottom: 20px;

      :deep(.arco-table-pagination) {
        position: fixed;
        right: 0;
        bottom: 0;
        left: v-bind(sidebarleft);
        z-index: 1000;
        padding: 14px 0;
        background-color: white;
        border-top: solid 1px @color-border-2;
      }

      :deep(.arco-scrollbar-thumb) {
        opacity: 1;
      }

      :deep(.arco-scrollbar-track) {
        position: fixed;
        right: 0;
        bottom: 50px;
        left: v-bind(sidebarleft);
      }
    }
  }
</style>
