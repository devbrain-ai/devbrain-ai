import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false, // 关掉类型文件打包，避开 TypeScript 6.0 的严格限制
  clean: true,
  shims: true,
});