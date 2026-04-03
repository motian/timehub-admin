export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  id: number;
  name?: string;
  mobile?: string;
  avatar?: string;
  teamId: number;
  currentRole: RoleType;
}
