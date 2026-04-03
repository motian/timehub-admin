import dayjs from 'dayjs';
import { get as getObjectVal, isArray, isNull, isUndefined } from 'lodash-es';
import { MetadataEnum, getReflectMetadata } from './attribute';

function getMetadataValue(target: any, propertyKey: string, metadataKey: any) {
  const keyArr = String(propertyKey).split('.');
  if (keyArr.length === 1) {
    return getReflectMetadata(metadataKey, target, propertyKey);
  }
  const targetKey = keyArr.slice(0, -1).join('.');
  const metaObject = getObjectVal(target, targetKey);
  if (isUndefined(metaObject)) return undefined;
  if (isNull(metaObject)) return null;
  const metaKey = keyArr.slice(-1).join('.');
  const metaValue = getReflectMetadata(metadataKey, metaObject, metaKey);
  return metaValue;
}

/**
 * 获取 target[propertyKey] 的 @itemModel 信息
 * @param target
 * @param propertyKey 支持 a.b.c 访问子对象
 * @returns
 */
export function getItemModelMetadata(target: any, propertyKey: string) {
  return getMetadataValue(target, propertyKey, MetadataEnum.ITEM_MODEL);
}

/**
 * 获取 target[propertyKey] 的 @ignore 信息
 * @param target
 * @param propertyKey 支持 a.b.c 访问子对象
 * @returns
 */
export function getIgnoreMetadata(
  target: any,
  propertyKey: string,
  defaultValue = false
) {
  const ignore = getMetadataValue(target, propertyKey, MetadataEnum.IGNORE);
  return isUndefined(ignore) ? defaultValue : ignore;
}

/**
 * 获取 target[propertyKey] 的 @title 信息
 * @param target
 * @param propertyKey 支持 a.b.c 访问子对象
 * @returns
 */
export function getTitleMetadata(target: any, propertyKey: string) {
  return getMetadataValue(target, propertyKey, MetadataEnum.TITLE);
}

/**
 * 获取 target[propertyKey] 的 @required 信息
 * @param target
 * @param propertyKey 支持 a.b.c 访问子对象
 * @returns
 */
export function getRequiredMetadata(
  target: any,
  propertyKey: string,
  defaultValue: boolean | undefined = undefined
) {
  const required = getMetadataValue(target, propertyKey, MetadataEnum.REQUIRED);
  return isUndefined(required) ? defaultValue : required;
}

/**
 * 获取 target[propertyKey] 的 @autoSum 信息
 * @param target
 * @param propertyKey 支持 a.b.c 访问子对象
 * @returns
 */
export function getAutoSumMetadata(target: any, propertyKey: string) {
  return getMetadataValue(target, propertyKey, MetadataEnum.AUTO_SUM);
}

/**
 * 获取 target[propertyKey] 的 @format 信息
 * @param target
 * @param propertyKey 支持 a.b.c 访问子对象
 * @returns
 */
export function getFormatMetadata(target: any, propertyKey: string) {
  return getMetadataValue(target, propertyKey, MetadataEnum.FORMAT);
}

/**
 * 获取 target[propertyKey] 的 @exportFormat 信息
 * @param target
 * @param propertyKey 支持 a.b.c 访问子对象
 * @returns
 */
export function getExportFormatMetadata(target: any, propertyKey: string) {
  return getMetadataValue(target, propertyKey, MetadataEnum.EXPORT_FORMAT);
}

/**
 * 获取 target[propertyKey] 的 @explain 信息
 * @param target
 * @param propertyKey 支持 a.b.c 访问子对象
 * @returns
 */
export function getExplainMetadata(target: any, propertyKey: string) {
  return getMetadataValue(target, propertyKey, MetadataEnum.EXPLAIN);
}

/**
 * 格式化数据
 * @param value 格式化的数据
 * @param formatType 格式化类型
 * @param config formatType 为 option 时，需要配置 options 选项列表
 * @returns
 */
export function formatValue(value: any, formatType: any, config: any = null) {
  if (formatType instanceof Function) {
    return formatType(value);
  }
  switch (formatType) {
    case 'option':
      if (!isArray(config)) return value;
      return (isArray(value) ? value : [value])
        .map((v) => {
          return config.find((item: any) => item.value === v)?.label;
        })
        .join('、');
    case 'numberW':
      if (!isArray(config)) config = [config];
      if (config.includes('positive') && Number(value) <= 0) {
        return '';
      }
      if (config.includes('nonCalc')) {
        return `${Number(Number(value).toFixed(2))}万`;
      }
      return `${Number((Number(value) / 10000).toFixed(2))}万`;
    case 'int':
      if (config.includes('positive') && Number(value) <= 0) {
        return '';
      }
      return parseInt(value, 10);
    case 'float':
      if (config.includes('positive') && Number(value) <= 0) {
        return '';
      }
      return Number(Number(value).toFixed(4));
    case 'rate':
      return `${value}%`;
    case 'date':
      if (Number(value.split('-')?.[0]) <= 1) {
        // 小于公元1年
        return '';
      }
      return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : value;
    case 'datetime':
      return dayjs(value).isValid()
        ? dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        : value;
    default:
      return value;
  }
  return value;
}

/**
 * 获取 target[propertyKey] 的 格式化信息
 * @param target
 * @param propertyKey 支持 a.b.c 访问子对象
 * @param customFormat 自定义格式化类型（默认根据注解获取）
 * @returns
 */
export function getFormatValue(
  target: any,
  propertyKey: string,
  customFormat = ''
) {
  if (!target) target = {};
  const value = getObjectVal(target, propertyKey);
  const metadata: any = getFormatMetadata(target, propertyKey);
  const formatType = customFormat || metadata?.format;
  if (!formatType) return value;
  return formatValue(value, formatType, metadata.config);
}

/**
 * 获取 target 对象上定义 @primary() 的属性列表
 * @param target
 * @returns
 */
export function getPrimaryKey(target: any): string[] {
  const keyList: string[] = [];
  for (const key in target) {
    if (getMetadataValue(target, key, MetadataEnum.PRIMARY)) {
      keyList.push(key);
    }
  }
  return keyList;
}
