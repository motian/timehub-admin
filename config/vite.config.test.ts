/**
 * 测试环境构建配置
 * 优化点：
 * - 移除 imagemin（原生依赖在 QEMU 下极慢，项目仅 2 张图片）
 * - 移除 visualizer（分析报告测试环境不需要）
 * - 保留 gzip 压缩（Nginx 需要）
 * - 保留 Arco 按需加载（减小包体积）
 */
import { defineConfig, mergeConfig } from 'vite';
import getBaseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configArcoResolverPlugin from './plugin/arcoResolver';

export default defineConfig(({ mode }) =>
  mergeConfig(getBaseConfig(mode), {
    mode: 'test',
    plugins: [configCompressPlugin('gzip'), configArcoResolverPlugin()],
    build: {
      // 关闭 sourcemap 加速构建
      sourcemap: false,
      // 使用 esbuild 压缩（比 terser 快 20-40 倍）
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            arco: ['@arco-design/web-vue'],
            chart: ['echarts', 'vue-echarts'],
            vue: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
  })
);
