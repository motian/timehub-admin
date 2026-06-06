/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 为 Vue 模板添加 JSX 类型支持，避免 TypeScript 误报
declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface Window {
  staticDomain: string;
  uploadDomain: string;
  appName: string;
  appIcon: string;
}
