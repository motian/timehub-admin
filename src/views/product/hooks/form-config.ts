import {
  isActivityProduct,
  isCreditProduct,
  PRODUCT_FEE_TYPE_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
} from '@/biz/const/product';
import { getOptions } from '@/biz/const/common';
import MProduct from '@/biz/model/product/product';
import { Ref } from 'vue';

const getFormConfig = (formData: Ref<MProduct>) => {
  return [
    {
      title: '基本信息',
      children: [
        {
          type: 'radio-group',
          label: '产品类型',
          name: 'type',
          bindAttrs: {
            options: PRODUCT_TYPE_OPTIONS,
          },
          rules: {
            type: 'number',
            positive: true,
            required: true,
            message: '请选择产品类型',
          },
        },
        {
          type: 'input',
          label: '产品名称',
          name: 'title',
          bindAttrs: {
            placeholder: '请输入产品名称',
          },
          rules: {
            required: true,
            message: '请输入产品名称',
          },
        },
        {
          type: 'input',
          label: '标签',
          name: 'tag',
          bindAttrs: {
            placeholder: '展示用标签，选填',
          },
        },
        {
          type: 'radio-group',
          label: '费用类型',
          name: 'feeType',
          bindAttrs: {
            options: PRODUCT_FEE_TYPE_OPTIONS,
          },
          bindEvents: {
            change: () => {
              if (formData.value.feeType === 1) {
                formData.value.salePrice = 0;
              }
            },
          },
          rules: {
            type: 'number',
            positive: true,
            required: true,
            message: '请选择费用类型',
          },
        },
        {
          type: 'input-number',
          label: '销售价格',
          name: 'salePrice',
          bindAttrs: {
            min: 0,
            precision: 2,
            placeholder: '请输入价格',
          },
          rules: {
            type: 'number',
            required: true,
            message: '请输入销售价格',
          },
          vIf: (product: MProduct) => product.feeType === 2,
        },
        {
          type: 'input-number',
          label: '赠送积分',
          name: 'credit',
          bindAttrs: {
            min: 0,
            precision: 0,
          },
        },
        {
          type: 'date-picker',
          label: '活动时间',
          name: 'startAt',
          bindAttrs: {
            showTime: true,
            format: 'YYYY-MM-DD HH:mm',
            placeholder: '请选择活动时间',
          },
          rules: {
            required: true,
            message: '请选择活动时间',
          },
          vIf: (product: MProduct) => isActivityProduct(product.type),
        },
        {
          type: 'input-number',
          label: '报名上限',
          name: 'memberLimit',
          bindAttrs: {
            min: 0,
            precision: 0,
            placeholder: '0 表示不限制',
          },
          vIf: (product: MProduct) => isActivityProduct(product.type),
        },
        {
          type: 'input-number',
          label: '最低成行人数',
          name: 'memberMin',
          bindAttrs: {
            min: 0,
            precision: 0,
            placeholder: '0 表示不限制',
          },
          vIf: (product: MProduct) => isActivityProduct(product.type),
        },
        {
          type: 'input-number',
          label: '可售库存',
          name: 'stock',
          bindAttrs: {
            min: 0,
            precision: 0,
          },
          vIf: (product: MProduct) => isCreditProduct(product.type),
        },
        {
          type: 'input',
          label: '短地址',
          name: 'shortAddress',
          bindAttrs: {
            placeholder: '如：西湖区 · 龙井村',
          },
        },
        {
          type: 'input',
          label: '完整地址',
          name: 'fullAddress',
          bindAttrs: {
            placeholder: '请输入完整地址',
          },
        },
        {
          type: 'radio-group',
          label: '上架状态',
          name: 'status',
          bindAttrs: {
            options: getOptions(['上架', '下架']),
          },
          rules: {
            type: 'number',
            positive: true,
            required: true,
            message: '请选择上架状态',
          },
          vIf: (product: MProduct) => product.id > 0,
        },
        {
          label: '产品封面',
          slotName: 'cover',
          rules: {
            required: true,
            validator: (value: string, callback: (msg?: string) => void) => {
              if (!value?.trim()) {
                callback('请上传封面或填写图片地址');
                return;
              }
              callback();
            },
          },
        },
        {
          label: '轮播图片',
          slotName: 'images',
        },
        {
          label: '活动详情',
          slotName: 'content',
        },
        {
          type: 'input',
          label: '地点名称',
          name: 'poiInfo.name',
          bindAttrs: {
            placeholder: '地图展示名称',
          },
          vIf: (product: MProduct) => isActivityProduct(product.type),
        },
        {
          type: 'input',
          label: '纬度',
          name: 'poiInfo.latitude',
          bindAttrs: {
            placeholder: '如：30.27415',
          },
          vIf: (product: MProduct) => isActivityProduct(product.type),
        },
        {
          type: 'input',
          label: '经度',
          name: 'poiInfo.longitude',
          bindAttrs: {
            placeholder: '如：120.15515',
          },
          vIf: (product: MProduct) => isActivityProduct(product.type),
        },
        {
          type: 'input',
          label: '坐标地址',
          name: 'poiInfo.address',
          bindAttrs: {
            placeholder: '与地图一致的地址',
          },
          vIf: (product: MProduct) => isActivityProduct(product.type),
        },
      ],
    },
  ];
};

export default getFormConfig;
