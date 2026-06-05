import { getOptions } from './common';

const Gender = ['男', '女'];

export const USER_STATUS_OPTIONS = getOptions(['正常', '禁用']);
const Position = ['置业顾问', '销售顾问', '店长', '客服运营', '上级管理'];
const PositionTypeOptions = [
  {
    label: '管理员',
    value: -1,
  },
  {
    label: '普通成员',
    value: 0,
  },
  {
    label: '部门上级',
    value: 1,
  },
  {
    label: '行政秘书',
    value: 2,
  },
  {
    label: '财务',
    value: 3,
  },
];

const CUser = {
  Gender,
  Position,
  PositionTypeOptions,
};

export default CUser;
