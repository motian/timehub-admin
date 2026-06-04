import { SIGHT_FEE_TYPE_OPTIONS } from '@/biz/const/sight';
import MSight from '@/biz/model/sight/sight';
import { Ref } from 'vue';

const getFormConfig = (formData: Ref<MSight>) => {
  return [
    {
      title: '基本信息',
      children: [
        {
          type: 'input',
          label: '市集名称',
          name: 'title',
          bindAttrs: {
            placeholder: '请输入市集名称',
          },
          rules: {
            required: true,
            message: '请输入市集名称',
          },
        },
        {
          type: 'textarea',
          label: '亮点简介',
          name: 'brief',
          bindAttrs: {
            placeholder: '请输入亮点简介',
            autoSize: { minRows: 2, maxRows: 4 },
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
          label: '所属栏目',
          slotName: 'sectionIds',
          rules: {
            required: true,
            validator: (
              value: number[] | undefined,
              callback: (msg?: string) => void
            ) => {
              if (!value?.length) {
                callback('请选择所属栏目');
                return;
              }
              callback();
            },
          },
        },
        {
          type: 'radio-group',
          label: '费用类型',
          name: 'feeType',
          bindAttrs: {
            options: SIGHT_FEE_TYPE_OPTIONS,
          },
          bindEvents: {
            change: () => {
              if (formData.value.feeType === 1) {
                formData.value.ticketPrice = 0;
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
          label: '门票价格',
          name: 'ticketPrice',
          bindAttrs: {
            min: 0,
            precision: 2,
            placeholder: '请输入门票价格',
          },
          rules: {
            type: 'number',
            required: true,
            message: '请输入门票价格',
          },
          vIf: (sight: MSight) => sight.feeType === 2,
        },
        {
          type: 'input',
          label: '短地址',
          name: 'shortAddress',
          bindAttrs: {
            placeholder: '如：西湖区 · 龙井村',
          },
          rules: {
            required: true,
            message: '请输入短地址',
          },
        },
        {
          type: 'input',
          label: '完整地址',
          name: 'fullAddress',
          bindAttrs: {
            placeholder: '请输入完整地址',
          },
          rules: {
            required: true,
            message: '请输入完整地址',
          },
        },
        {
          type: 'date-picker',
          label: '开放开始日期',
          name: 'startDate',
          bindAttrs: {
            format: 'MM-DD',
            showNowBtn: false,
            placeholder: '如 01-01 表示全年',
            popupContainer: '.sight-editor',
          },
        },
        {
          type: 'date-picker',
          label: '开放结束日期',
          name: 'endDate',
          bindAttrs: {
            format: 'MM-DD',
            showNowBtn: false,
            placeholder: '如 12-31 表示全年',
            popupContainer: '.sight-editor',
          },
        },
        {
          type: 'time-picker',
          label: '每日开始时间',
          name: 'startTime',
          bindAttrs: {
            format: 'HH:mm',
            placeholder: '请选择开始时间',
          },
        },
        {
          type: 'time-picker',
          label: '每日结束时间',
          name: 'endTime',
          bindAttrs: {
            format: 'HH:mm',
            placeholder: '请选择结束时间',
          },
        },
        {
          label: '封面图',
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
          label: '市集详情',
          slotName: 'content',
        },
      ],
    },
  ];
};

export default getFormConfig;
