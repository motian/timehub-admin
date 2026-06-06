import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useTeamStore from './modules/team';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useTeamStore };
export default pinia;
