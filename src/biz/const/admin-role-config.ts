/** 角色类型，对应 admin_role_config.type */
export enum AdminRoleConfigType {
  Super = 0,
  System = 1,
  Custom = 2,
}

/** type=0 超管、type=1 系统内置 */
export function isBuiltinAdminRole(type: number) {
  return (
    type === AdminRoleConfigType.Super || type === AdminRoleConfigType.System
  );
}

/** type=2 自定义角色 */
export function isCustomAdminRole(type: number) {
  return type === AdminRoleConfigType.Custom;
}

/** 仅自定义角色可删除，且不能有关联成员 */
export function canDeleteAdminRole(record: {
  type: number;
  adminCount?: number;
}) {
  return isCustomAdminRole(record.type) && !record.adminCount;
}
