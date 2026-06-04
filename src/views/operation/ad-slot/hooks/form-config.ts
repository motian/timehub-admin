import { AD_SLOT_REDIRECT_TYPE_OPTIONS } from '@/biz/const/ad-slot';

const getFormConfig = () => {
  return [
    {
      title: '基本信息',
      children: [
        {
          type: 'input',
          label: '标题',
          name: 'title',
          bindAttrs: {
            placeholder: '请输入标题',
          },
          rules: {
            required: true,
            message: '请输入标题',
          },
        },
        {
          type: 'radio-group',
          label: '跳转类型',
          name: 'redirectType',
          bindAttrs: {
            options: AD_SLOT_REDIRECT_TYPE_OPTIONS,
          },
          rules: {
            type: 'number',
            positive: true,
            required: true,
            message: '请选择跳转类型',
          },
        },
        {
          label: '跳转配置',
          slotName: 'redirectData',
        },
        {
          label: '封面图',
          slotName: 'cover',
          rules: {
            required: true,
            validator: (value: string, callback: (msg?: string) => void) => {
              if (!value?.trim()) {
                callback('请上传封面图');
                return;
              }
              callback();
            },
          },
        },
      ],
    },
  ];
};

export default getFormConfig;
