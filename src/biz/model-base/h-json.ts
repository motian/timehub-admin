import { isNumber, isArray, isString, isFunction } from 'lodash-es';
import BaseModel from './common/base-model';
import {
  formatValue,
  getFormatMetadata,
  getItemModelMetadata,
} from './decorator/metada';

const HJson = {
  fromJsonArray<T extends BaseModel>(
    jsonArray: any,
    Type: { new (item: any): T }
  ): T[] {
    if (!isArray(jsonArray)) {
      return [];
    }
    const list: T[] = [];
    jsonArray.forEach((jsonItem: any) => {
      const itemData = this.fromJson(jsonItem, Type);
      list.push(itemData);
    });
    return list;
  },
  fromJson<T extends BaseModel>(jsonObj: any, Type: { new (item: any): T }): T {
    if (!jsonObj) {
      return new Type(null);
    }
    const modelObj = new Type(jsonObj);
    // eslint-disable-next-line no-restricted-syntax
    for (const key in modelObj) {
      if (!Reflect.has(jsonObj, key)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const jsonValue = jsonObj[key];
      const itemValue = modelObj[key] as any;
      const ModelConstructor = getItemModelMetadata(modelObj, key);
      if (isNumber(itemValue)) {
        this.setAttribute(modelObj, key, Number(jsonValue));
      } else if (isString(itemValue)) {
        this.setAttribute(modelObj, key, jsonValue?.toString() || '');
      } else if (ModelConstructor) {
        if (isArray(itemValue)) {
          const jsonArray = jsonValue || [];
          const list: any[] = [];
          jsonArray.forEach((jsonItem: any) => {
            const itemData = this.fromJson(jsonItem, ModelConstructor);
            list.push(itemData);
          });
          this.setAttribute(modelObj, key, list);
        } else {
          const data = this.fromJson(jsonValue, ModelConstructor);
          this.setAttribute(modelObj, key, data);
        }
      } else {
        this.setAttribute(modelObj, key, jsonValue);
      }
    }

    const model: any = modelObj;
    if (model.fromJson && isFunction(model.fromJson)) {
      model.fromJson(jsonObj);
    }
    return model;
  },
  setAttribute(modelObj: any, key: string, value: any) {
    const metadata = getFormatMetadata(modelObj, key);
    if (metadata?.config === 'save') {
      modelObj[key] = formatValue(value, metadata.format, metadata.config);
    } else {
      modelObj[key] = value;
    }
  },
};

export default HJson;
