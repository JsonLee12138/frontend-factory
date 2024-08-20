import { type ConfigEnv, defineConfig, loadEnv, ProxyOptions, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

type ProxyItem = [string, string];
const createProxy = (proxies: ProxyItem[]): Record<string, ProxyOptions> => {
  if (!proxies) return {};
  const res: Record<string, ProxyOptions> = {};
  const httpsREG = /^https:\/\//;
  for (const [p, t] of proxies) {
    const isHttps = httpsREG.test(t);
    res[p] = {
      target: t,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${p}`), ''),
      ...(isHttps ? { secure: false } : {})
    }
  }
  return res;
}
// https://vitejs.dev/config/
export default defineConfig(({mode}: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [react({
      babel: {
        plugins: [['@babel/plugin-proposal-decorators', { legacy: true }], '@babel/plugin-proposal-class-properties', '@babel/plugin-transform-private-methods'],
      },
    })],
    base: './',
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      proxy: createProxy(JSON.parse(env['VITE_PROXY'] || '[]')),
    },
  }
});
