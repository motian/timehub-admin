<script lang="ts" setup>
  const onOpenIcp = () => {
    window.open('https://beian.miit.gov.cn/');
  };
</script>

<template>
  <a-layout-footer class="footer">
    <span>河图云 · 版权所有©2026 广州市渐丰网络科技有限公司</span>
    <span class="wm-lr-5">|</span>
    <span class="h-pointer" @click="onOpenIcp()">粤ICP备2023156463号-7</span>
  </a-layout-footer>
</template>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>
