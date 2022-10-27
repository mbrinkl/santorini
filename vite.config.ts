import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import path from 'path';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    open: true,
    port: 3000,
  },
  resolve: {
    alias: [
      { find: '~styles', replacement: path.resolve(__dirname, './src/styles') },
      { find: '~', replacement: __dirname },
    ],
  },
});
