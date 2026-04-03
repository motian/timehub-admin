/* eslint-disable */

import BaseModel from './base-model';
import { getAutoSumMetadata } from '../decorator/metada';
import {
  cloneDeep,
  isNumber,
  get as getObjectVal,
  set as setObjectVal,
  isArray,
  isObject,
  isUndefined,
  isNull,
} from 'lodash-es';
import HJson from '../h-json';

export function getPlainKeys(obj: any) {
  const keys: string[] = [];
  for (const key in obj) {
    if (
      isUndefined(obj[key]) ||
      isNull(obj[key]) ||
      Object.keys(obj[key]).length == 0
    ) {
      // 空数组 或 空对象
      keys.push(key);
    } else if (isObject(obj[key])) {
      const objKeys = getPlainKeys(obj[key]);
      const planKeys = objKeys.map((objKey) => `${key}.${objKey}`);
      keys.push(...planKeys);
    } else {
      keys.push(key);
    }
  }
  return keys;
}

export default class BasePage<T extends BaseModel> {
  modelConstructor: { new (item: any): T } | null = null;

  list: T[] = [];

  constructor(type: { new (item: any): T } | null = null) {
    this.modelConstructor = type;
  }

  createModel(item: any = null): T {
    const ModelConstructor =
      this.modelConstructor || (this as any)['_modelConstructor'];
    if (ModelConstructor) {
      return HJson.fromJson(item, ModelConstructor);
    }
    throw new Error('modelConstructor can not be null!');
  }

  /**
   * 返回 list 元素对应 key 的数组，key 支持 a.b.c
   */
  columns(key: string) {
    return this.list.map((item: BaseModel) => {
      return getObjectVal(item, key);
    });
  }

  /**
   * 返回 list 元素对应 key 的数组，key 支持 a.b.c
   */
  unique(key: string) {
    return Array.from(new Set(this.columns(key)));
  }

  /**
   * 查找并拷贝 list 满足条件的第一个元素
   * @param key key 支持 a.b.c，key 为数组时表示满足任一 key
   * @param value 查找对应 key 值为 value 的元素
   * @returns
   */
  cloneItem(key: string | string[], value: string | number): T | undefined {
    const item = this.findItem(key, value);
    if (item) return cloneDeep(item);
    return undefined;
  }

  cloneOrNewItem(key: string | string[], value: string | number): T {
    const item = this.cloneItem(key, value);
    return item || this.createModel();
  }

  /**
   * 查找 list 并返回满足条件的第一个元素
   * @param key key 支持 a.b.c，key 为数组时表示满足任一 key
   * @param value 查找对应 key 值为 value 的元素
   * @returns
   */
  findItem(key: string | string[], value: string | number) {
    const keyArr = isArray(key) ? key : [key];
    for (const itemKey of keyArr) {
      const itemValue = this.list.find((item) => {
        return getObjectVal(item, itemKey) === value;
      });
      if (itemValue) {
        return itemValue;
      }
    }
    return undefined;
  }

  /**
   * list 就地排序
   * @param key key 支持 a.b.c
   * @param orderType ['asc', 'desc', 'ascend', 'descend']
   */
  orderBy(key: string, orderType = 'asc') {
    this.list.sort((a: BaseModel, b: BaseModel) => {
      const value1 = getObjectVal(a, key);
      const value2 = getObjectVal(b, key);
      if (orderType.indexOf('asc') === 0) {
        return value1 >= value2 ? 1 : -1;
      }
      return value2 > value1 ? 1 : -1;
    });
    return this;
  }

  /**
   * 获取对 @autoSum 标记求和后的对象
   * @param type 构造函数
   * @returns
   */
  getLocalSummary(list: T[] | null = null) {
    if (!list) {
      list = this.list;
    }
    const summaryData = this.createModel(null);
    const plainKeys = getPlainKeys(summaryData);
    for (const item of list) {
      for (const key of plainKeys) {
        const autoSumMetadata = getAutoSumMetadata(item, key);
        if (autoSumMetadata === 'number' || autoSumMetadata === 'avg') {
          const itemValue = getObjectVal(item, key);
          if (isNumber(itemValue)) {
            const sumValue = getObjectVal(summaryData, key) + itemValue;
            setObjectVal(summaryData, key, Number(sumValue.toFixed(2)));
          } else {
            setObjectVal(summaryData, key, itemValue);
          }
        } else if (autoSumMetadata === 'flag') {
          setObjectVal(summaryData, key, '合计');
        }
      }
    }
    for (const key of plainKeys) {
      const autoSumMetadata = getAutoSumMetadata(summaryData, key);
      if (autoSumMetadata === 'avg') {
        const itemValue = getObjectVal(summaryData, key);
        const { length } = list.filter((item) => {
          const value = getObjectVal(item, key);
          return value > 0;
        });
        const avgValue = itemValue / length;
        setObjectVal(summaryData, key, Number(avgValue.toFixed(2)));
      }
    }
    return summaryData;
  }

  clear() {
    this.list = [];
  }
}
