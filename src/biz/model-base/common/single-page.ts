import { isArray } from 'lodash-es';
import BaseModel from './base-model';
import BasePage from './base-page';

export default class SinglePage<T extends BaseModel> extends BasePage<T> {
  list: T[] = [];

  fromJson(result: any[]) {
    this.list = [];
    if (!isArray(result)) {
      return;
    }
    result?.forEach((item: any) => {
      const model = this.createModel(item);
      this.list.push(model);
    });
  }
}
