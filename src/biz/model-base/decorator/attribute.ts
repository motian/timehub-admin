import { isArray } from 'lodash-es';
import 'reflect-metadata';

export const MetadataEnum = {
  MODEL: Symbol('model'),
  ITEM_MODEL: Symbol('item_model'),
  FORMAT: Symbol('format'),
  EXPORT_FORMAT: Symbol('export_format'),
  EXPLAIN: Symbol('explain'),
  AUTO_SUM: Symbol('autoSum'),
  TITLE: Symbol('title'),
  REQUIRED: Symbol('required'),
  PRIMARY: Symbol('primary'),
  IGNORE: Symbol('ignore'),
};

/** 定义模型构造函数 */
export function model(modelConstructor: any) {
  // eslint-disable-next-line func-names
  return function (constructor: any) {
    // eslint-disable-next-line no-underscore-dangle
    constructor.prototype._modelConstructor = modelConstructor;
  };
}

/** 定义属性的构造函数 */
export function itemModel(modelConstructor: any) {
  return Reflect.metadata(MetadataEnum.ITEM_MODEL, modelConstructor);
}

/** 定义主键 */
export function primary(params = true) {
  return Reflect.metadata(MetadataEnum.PRIMARY, params);
}

/** 定义导出格式类型 */
export function exportFormat(params: string) {
  return Reflect.metadata(MetadataEnum.EXPORT_FORMAT, params);
}

/** 定义是否忽略 */
export function ignore(params = true) {
  return Reflect.metadata(MetadataEnum.IGNORE, params);
}

/** 作用属性是否必选 */
export function required(params = true) {
  return Reflect.metadata(MetadataEnum.REQUIRED, params);
}

/** 定义属性标题 */
export function title(params: string | string[]) {
  return Reflect.metadata(MetadataEnum.TITLE, params);
}

/** 定义属性含义 */
export function explain(params: string | any) {
  return Reflect.metadata(MetadataEnum.EXPLAIN, params);
}

/** 作用于模型格式化输出 */
export function format(formatType: any, config: any = null) {
  if (!isArray(formatType)) {
    formatType = [formatType];
  }
  const formatConfig = {
    format: formatType?.[0],
    title: formatType?.[1],
    config,
  };
  return Reflect.metadata(MetadataEnum.FORMAT, formatConfig);
}

/** 作用于模型自动求和 */
export function autoSum(metadataValue = 'number') {
  return Reflect.metadata(MetadataEnum.AUTO_SUM, metadataValue);
}

export function getReflectMetadata(
  metadataKey: any,
  target: any,
  propertyKey: string | symbol
) {
  return Reflect.getMetadata(metadataKey, target, propertyKey);
}

export default MetadataEnum;
