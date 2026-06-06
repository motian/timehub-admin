<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <a-space>
          <img
            style="width: 30px; height: 30px"
            src="https://timehub-static.haocode.net/Fgkg_BBy9ke77e5v4aMSmIyTyOIA.png"
          />
          <h2 style="font-weight: bold; font-size: 20px">拾光巷漫集</h2>
        </a-space>
        <icon-menu-fold
          v-if="appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <ul class="right-side">
      <li>
        <a-dropdown trigger="hover">
          <a-space class="user-dropdown">
            <img
              width="30"
              src="https://timehub-static.haocode.net/Fgkg_BBy9ke77e5v4aMSmIyTyOIA.png"
            />
            <span>{{ userStore.userInfo.mobile }}</span>
            <icon-caret-down />
          </a-space>
          <template #content>
            <div class="login-username">{{ userStore.userInfo.name }}</div>
            <a-doption>
              <a-space @click="handleResetPassword">
                <icon-lock />
                <span> 修改密码 </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span> 退出登录 </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>

    <a-modal
      v-model:visible="passwordModal.show"
      width="480px"
      title="修改密码"
      :on-before-ok="onResetPassword"
    >
      <a-form ref="resetFormRef" :model="passwordModal.form" auto-label-width>
        <a-form-item label="用户">
          <span>{{ userStore.userInfo.name }}</span>
        </a-form-item>
        <a-form-item
          label="旧密码"
          field="oldPassword"
          :rules="[{ required: true, message: '请输入旧密码' }]"
        >
          <a-input-password
            v-model="passwordModal.form.oldPassword"
            placeholder="请输入账号密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="新密码"
          field="newPassword"
          :rules="[{ required: true, message: '请输入新密码' }]"
        >
          <a-input-password
            v-model="passwordModal.form.newPassword"
            placeholder="请输入账号密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
          field="newPassword2"
          :rules="[{ required: true, message: '请确认新密码' }]"
        >
          <a-input-password
            v-model="passwordModal.form.newPassword2"
            placeholder="请输入账号密码"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import authApi from '@/api/biz/auth/auth';
  import useUser from '@/hooks/user';
  import { useAppStore, useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import type { FormInstance } from '@arco-design/web-vue';
  import md5 from 'md5';
  import { inject, ref } from 'vue';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { logout } = useUser();
  const resetFormRef = ref<FormInstance>();
  const passwordModal = ref({
    show: false,
    form: {
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
    },
  });

  async function onResetPassword() {
    const errors = await resetFormRef.value?.validate();
    if (errors) {
      const key = Object.keys(errors)?.[0];
      Message.warning(errors?.[key]?.message);
      return false;
    }
    const { oldPassword, newPassword, newPassword2 } = passwordModal.value.form;
    if (newPassword !== newPassword2) {
      Message.warning('密码不一致，请确认后重新输入!');
      return false;
    }
    await authApi.ResetPassword({
      mode: 2,
      oldPassword: md5(oldPassword),
      newPassword: md5(newPassword),
    });
    Message.success('修改成功!');
    return true;
  }

  const handleResetPassword = () => {
    passwordModal.value.show = true;
    passwordModal.value.form = {
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
    };
  };

  const handleLogout = () => {
    logout();
  };

  const toggleDrawerMenu = inject<any>('toggleDrawerMenu');
</script>

<style scoped lang="less">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);

    .user-dropdown {
      cursor: pointer;

      :deep(.arco-dropdown-open) .arco-icon-caret-down {
        transform: rotate(180deg);
      }
    }
  }

  .login-username {
    padding: 12px;
    font-weight: bold;
    border-bottom: solid 1px @color-border-2;
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 16px;

    img {
      width: 200px;
      height: 35px;
    }
  }

  .right-side {
    z-index: 1;
    display: flex;
    padding-right: 20px;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }
  }
</style>
