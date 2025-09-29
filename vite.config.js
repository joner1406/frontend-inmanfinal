import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default ({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [vue()],
    server: {
      port: 5173,
      proxy: env.VITE_API_BASE_URL ? undefined : {
        // Configuración de proxy solo para desarrollo
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          ws: true,
        }
      }
    },
    define: {
      'process.env': {}
    },
    // Configuración para producción
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  });
};
