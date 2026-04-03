import BaseModel from './base-model';
import BasePage from './base-page';

type getTableDataFunc = (params: { page: number; pageSize: number }) => void;

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
  getTableData?: getTableDataFunc;
}

export default class MultiPage<T extends BaseModel> extends BasePage<T> {
  list: Array<T> = [];

  pagination: Pagination = {
    current: 0,
    pageSize: 0,
    total: 0,
  };

  extra: any = {};

  static fromJson(result: any, Type: { new (item: any): any }) {
    const data = new MultiPage(Type);
    data.list = [];
    result.list?.forEach((item: any) => {
      const model = data.createModel(item);
      data.list.push(model);
    });
    data.pagination.current = result.page || 0;
    data.pagination.pageSize = result.pageSize || 0;
    data.pagination.total = result.total || result.pageInfo?.totalNumber || 0;

    const whiteList = ['list', 'page', 'pageSize', 'total'];
    Object.keys(result).forEach((key) => {
      if (!whiteList.includes(key)) {
        data.extra[key] = result[key];
      }
    });
    return data;
  }

  setDataFunc(func: getTableDataFunc) {
    this.pagination.getTableData = func;
    return this;
  }

  clear() {
    super.clear();
    this.pagination.current = 0;
    this.pagination.pageSize = 0;
    this.pagination.total = 0;
  }
}
