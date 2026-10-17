import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@@', replacement: fileURLToPath(new URL('.', import.meta.url)) },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    exclude: ['node_modules/**', '.output/**'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
    },
  },
});
