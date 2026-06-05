import {
  ARTICLE_TYPE_OPTIONS,
  ARTICLE_AGREEMENT_TYPE_OPTIONS,
  isAgreementArticle,
  needsCover,
} from '@/biz/const/article';
import { getOptions } from '@/biz/const/common';
import MArticle from '@/biz/model/article/article';
import { Ref } from 'vue';

const getFormConfig = (formData: Ref<MArticle>) => {
  return [
    {
      title: '基本信息',
      children: [
        {
          type: 'radio-group',
          label: '文章分类',
          name: 'type',
          bindAttrs: {
            options: ARTICLE_TYPE_OPTIONS,
            placeholder: '请选择文章类型',
          },
          bindEvents: {
            change: () => {
              if (formData.value.type === 2) {
                formData.value.content = '';
              }
              if (!isAgreementArticle(formData.value.type)) {
                formData.value.agreementType = 0;
              }
              if (!needsCover(formData.value.type)) {
                formData.value.cover = '';
              }
            },
          },
          rules: {
            type: 'number',
            positive: true,
            required: true,
            message: '请选择文章类型',
          },
        },
        {
          type: 'radio-group',
          label: '协议类型',
          name: 'agreementType',
          bindAttrs: {
            options: ARTICLE_AGREEMENT_TYPE_OPTIONS,
            placeholder: '请选择协议类型',
          },
          rules: {
            type: 'number',
            positive: true,
            required: true,
            message: '请选择协议类型',
          },
          vIf: (article: MArticle) => isAgreementArticle(article.type),
        },
        {
          type: 'input',
          label: '文章标题',
          name: 'title',
          bindAttrs: {
            placeholder: '请输入文章标题',
          },
          rules: {
            required: true,
            message: '请输入文章标题',
          },
        },
        {
          type: 'radio-group',
          label: '上架状态',
          name: 'status',
          bindAttrs: {
            options: getOptions(['上架', '下架']),
            placeholder: '请选择上架状态',
          },
          rules: {
            type: 'number',
            positive: true,
            required: true,
            message: '请选择上架状态',
          },
          vIf: (article: MArticle) => article.id > 0,
        },
        {
          type: 'date-picker',
          label: '上架时间',
          name: 'publishAt',
          bindAttrs: {
            showTime: true,
            format: 'YYYY-MM-DD HH:mm',
            placeholder: '请选择上架时间',
          },
          vIf: (article: MArticle) => article.status === 1,
        },
        {
          label: '文章封面',
          slotName: 'cover',
          vIf: (article: MArticle) => needsCover(article.type),
          rules: {
            validator: (value: string, callback: (msg?: string) => void) => {
              if (!needsCover(formData.value.type)) {
                callback();
                return;
              }
              if (!value?.trim()) {
                callback('请上传封面图或填写封面地址');
                return;
              }
              callback();
            },
          },
        },
        {
          label: '轮播图片',
          slotName: 'images',
          vIf: (article: MArticle) => article.type === 1,
        },
        {
          label: '正文',
          slotName: 'content',
        },
      ],
    },
  ];
};

export default getFormConfig;
