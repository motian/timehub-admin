/** 角色类型，对应 admin_role_config.type */
export enum AdminRoleConfigType {
  Super = 0,
  System = 1,
  Custom = 2,
}

export function isBuiltinAdminRole(type: number) {
  return (
    type === AdminRoleConfigType.Super || type === AdminRoleConfigType.System
  );
}

/** 仅自定义角色可删除 */
export function canDeleteAdminRole(record: {
  type: number;
  adminCount?: number;
}) {
  return !isBuiltinAdminRole(record.type) && !record.adminCount;
}
