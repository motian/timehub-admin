import {
  getUserInfo,
  LoginData,
  login as userLogin,
  logout as userLogout,
} from '@/api/user';
import HJson from '@/biz/model-base/h-json';
import MAdminInfo from '@/biz/model/admin/admin-info';
import { clearToken, setToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { defineStore } from 'pinia';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): MAdminInfo => new MAdminInfo(),

  getters: {
    userInfo(state: MAdminInfo): MAdminInfo {
      return HJson.fromJson({ ...state }, MAdminInfo);
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.currentRole = this.currentRole === 'user' ? 'admin' : 'user';
        resolve(this.currentRole);
      });
    },
    // Set user's information
    setInfo(partial: Partial<MAdminInfo>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const { data } = await getUserInfo();
      const info = HJson.fromJson(data, MAdminInfo);
      this.setInfo(info);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin({
          isAdmin: 1,
          ...loginForm,
        });
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
