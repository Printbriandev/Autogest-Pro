import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// El backend expone CORS para http://localhost:3000, por eso el dev server
// corre en ese puerto. En desarrollo se hace proxy de /api hacia la API .NET
// (http://localhost:5000) para evitar problemas de CORS/origen mixto.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
