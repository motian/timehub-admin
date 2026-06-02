<template>
  <div class="container">
    <div class="logo">
      <img
        alt="logo"
        src="https://cdn.hetu.yun/assets/hetu-marketing-hub-white.png"
      />
    </div>
    <div class="banner">
      <div class="banner-inner">
        <a-carousel class="carousel" animation-name="fade">
          <a-carousel-item :key="carouselItem.slogan">
            <div :key="carouselItem.slogan" class="carousel-item">
              <div class="carousel-title">{{ carouselItem.slogan }}</div>
              <div class="carousel-sub-title">{{ carouselItem.subSlogan }}</div>
              <img class="carousel-image" :src="carouselItem.image" />
            </div>
          </a-carousel-item>
        </a-carousel>
      </div>
    </div>
    <div class="content">
      <div class="content-inner">
        <div class="login-form-wrapper">
          <div class="login-form-title">拾光巷漫集</div>
          <div class="login-form-sub-title"></div>
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
              <a-input
                v-model="userInfo.mobile"
                size="large"
                placeholder="请输入手机号"
              >
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
                placeholder="请输入密码"
                size="large"
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
              <a-input
                v-model="userInfo.captchaValue"
                placeholder="请输入验证码"
                size="large"
              >
                <template #prefix>
                  <icon-safe />
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
              <a-button
                type="primary"
                html-type="submit"
                long
                :loading="loading"
                size="large"
              >
                登 录
              </a-button>
            </a-space>
          </a-form>
        </div>
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';

  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { getCaptcha } from '@/api/user';
  import type { LoginData } from '@/api/user';

  import bannerImage from '@/assets/images/login-banner.png';

  const carouselItem = {
    slogan: '一站式智能营销私域中台',
    subSlogan: '私域运营工具，助力社群运营者高效管理社群，提升社群活跃度',
    image: bannerImage,
  };

  const router = useRouter();
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
      Message.error('验证码获取失败，请尝试刷新页面');
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
        Message.success('欢迎使用拾光巷漫集！');
        const { rememberPassword } = loginConfig.value;
        const { mobile, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.mobile = rememberPassword ? mobile : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
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
  .container {
    display: flex;
    height: 100vh;

    .banner {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);

      &-inner {
        flex: 1;
        height: 100%;
      }
    }

    .carousel {
      height: 100%;

      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      &-title {
        color: var(--color-fill-1);
        font-weight: 500;
        font-size: 26px;
        line-height: 28px;
        letter-spacing: 4px;
      }

      &-sub-title {
        margin-top: 8px;
        color: var(--color-text-3);
        font-size: 14px;
        line-height: 22px;
      }

      &-image {
        width: 320px;
        margin-top: 30px;
      }
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;

      .login-form {
        &-wrapper {
          width: 320px;
        }

        &-title {
          color: var(--color-text-1);
          font-weight: 500;
          font-size: 28px;
          line-height: 38px;
          letter-spacing: 4px;
        }

        &-sub-title {
          margin-bottom: 20px;
          color: var(--color-text-3);
          font-size: 15px;
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

        .arco-icon {
          font-size: 16px;
        }
      }
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    left: 16px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    height: 60px;

    img {
      width: 258px;
      height: 45px;
    }
  }

  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>
