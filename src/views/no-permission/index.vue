<template>
  <div class="content">
    <a-result
      class="result"
      status="403"
      :subtitle="'您没有访问权限，请联系管理员！'"
    >
    </a-result>
    <div class="operation-row">
      <a-button key="back" type="primary" @click="back"> 返回首页 </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store';

  const router = useRouter();
  const userStore = useUserStore();

  const back = () => {
    // warning： Go to the node that has the permission
    router.push({ name: userStore.userInfo.homePage });
  };
</script>

<style scoped lang="less">
  .content {
    // padding-top: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -121px;
    margin-left: -95px;
    text-align: center;
  }
</style>
