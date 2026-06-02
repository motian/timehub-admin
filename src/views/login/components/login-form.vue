<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">拾光巷漫集</div>
    <div class="login-form-sub-title">拾光巷漫集</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="mobile"
        :rules="[{ required: true, message: '手机号不能为空' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input v-model="userInfo.mobile" placeholder="请输入登录手机号">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: '密码不能为空' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          placeholder="请输入登录密码"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="captchaValue"
        :rules="[{ required: true, message: '验证码不能为空' }]"
        :style="{ 'text-align': 'right' }"
        hide-label
      >
        <a-input v-model="userInfo.captchaValue" placeholder="请输入验证码">
          <template #prefix>
            <MessageOutlined />
          </template>
        </a-input>
        <a-image
          class="img-code"
          :src="verifyCodeImage"
          :width="100"
          :height="40"
          :preview="false"
          @click="changeVerifyCode"
        />
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            记住密码
          </a-checkbox>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          登录
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import type { LoginData } from '@/api/user';
  import { getCaptcha } from '@/api/user';
  import useLoading from '@/hooks/loading';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useStorage } from '@vueuse/core';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    mobile: '', // 演示默认值
    password: '', // demo default value
  });
  const userInfo = reactive({
    mobile: loginConfig.value.mobile,
    password: loginConfig.value.password,
    captchaId: '',
    captchaValue: '',
  });
  const verifyCodeImage = ref<string>('');

  async function changeVerifyCode() {
    try {
      const { data } = await getCaptcha();
      verifyCodeImage.value = data.b64s;
      userInfo.captchaId = data.captchaId;
      userInfo.captchaValue = '';
    } catch (error) {
      errorMessage.value = '验证码获取失败，可以尝试刷新页面重新获取。';
    }
  }

  changeVerifyCode();

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(userInfo as LoginData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        await userStore.info();
        router.push({
          name: (redirect as string) || 'SettingAdmin',
          query: {
            ...othersQuery,
          },
        });
        Message.success('欢迎使用');
        const { rememberPassword } = loginConfig.value;
        const { mobile, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.mobile = rememberPassword ? mobile : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
        errorMessage.value = (err as Error).message;
        changeVerifyCode();
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
