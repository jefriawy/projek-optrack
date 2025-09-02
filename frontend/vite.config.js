import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_DEBUG': 'false',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'Buffer': ['buffer', 'Buffer'],
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
});