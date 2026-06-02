export type RoleType = '' | '*' | 'admin' | 'user';

export interface AdminSimple {
  id: number;
  teamId: number;
  name: string;
  mobile: string;
  avatar: string;
  gender: number;
  roleId: number;
}

export interface UserState {
  id: number;
  teamId: number;
  name?: string;
  mobile?: string;
  avatar?: string;
  gender?: number;
  roleId?: number;
  roleName?: string;
  remark?: string;
  status?: number;
  creatorId?: number;
  creator?: AdminSimple;
  team?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  currentRole: RoleType;
}
