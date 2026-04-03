// eslint-disable-next-line max-classes-per-file
import { format, itemModel } from '@/biz/model-base/decorator/attribute';
import BaseModel from '@/biz/model-base/common/base-model';

class BaseAdminMenu extends BaseModel {
  /**
   * 主键ID
   */
  id = 0;

  /**
   * 父级ID
   */
  parentId = 0;

  /**
   * 菜单名称
   */
  name = '';

  /**
   * 菜单路径
   */
  path = '';

  /**
   * 排序
   */
  sort = 0;

  /**
   * 状态
   */
  status = 0;

  /**
   * 创建时间
   */
  @format('datetime', 'save')
  createdAt = '';

  /**
   * 更新时间
   */
  @format('datetime', 'save')
  updatedAt = '';

  /**
   * 删除时间
   */
  deletedAt: string | null = null;
}

export default class MAdminMenu extends BaseAdminMenu {
  /**
   * 子菜单
   */
  @itemModel(BaseAdminMenu)
  items: BaseAdminMenu[] = [];
}
