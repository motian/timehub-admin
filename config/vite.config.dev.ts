import { defineConfig, mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import getBaseConfig from './vite.config.base';

export default defineConfig(({ mode }) =>
  mergeConfig(getBaseConfig(mode), {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  })
);
