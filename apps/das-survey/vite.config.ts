import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    alias: {
      '@digitalaidseattle/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@digitalaidseattle/mui': path.resolve(__dirname, '../../packages/mui/src/index.ts'),
      '@digitalaidseattle/draganddrop': path.resolve(__dirname, '../../packages/draganddrop/src/index.ts'),
      '@digitalaidseattle/resend': path.resolve(__dirname, '../../packages/resend/src/index.ts'),
      '@digitalaidseattle/surveys': path.resolve(__dirname, '../../packages/surveys/src/index.ts')
    }
  },
  plugins: [react()],
});
