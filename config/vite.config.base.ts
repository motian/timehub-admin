import { resolve } from 'path';
import type { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import configArcoStyleImportPlugin from './plugin/arcoStyleImport';

const APP_NAME = '拾光巷漫集';

/** 纯对象，供 mergeConfig；勿在此包 defineConfig 回调，否则与子配置 merge 时 alias 等会丢失 */
export default function getBaseConfig(_mode: string): UserConfig {
  return {
    base: '/',
    server: {
      host: '0.0.0.0',
    },
    plugins: [
      vue(),
      vueJsx(),
      svgLoader({ svgoConfig: {} }),
      configArcoStyleImportPlugin(),
      {
        name: 'html-env-replace',
        transformIndexHtml(html) {
          return html.replace(/%VITE_APP_NAME%/g, APP_NAME);
        },
      },
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, '../src'),
        },
        {
          find: 'assets',
          replacement: resolve(__dirname, '../src/assets'),
        },
        {
          find: 'vue',
          replacement: 'vue/dist/vue.esm-bundler.js', // compile template
        },
      ],
      extensions: ['.ts', '.js'],
    },
    define: {
      'process.env': {},
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve(
              'src/assets/style/breakpoint.less'
            )}"; @import (reference) "${resolve(
              'src/assets/style/color.less'
            )}";`,
          },
          javascriptEnabled: true,
        },
      },
    },
  };
}
