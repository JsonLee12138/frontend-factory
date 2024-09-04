import {
  type ConfigEnv,
  defineConfig,
  loadEnv,
  ProxyOptions,
  type UserConfig,
} from 'vite';
import react from '@vitejs/plugin-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;
type ProxyItem = [string, string];
const parseConfig = (env: Record<string, string>): AnyObject => {
  const res: AnyObject = {};
  for (const key in env) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      const item = env[key];
      const jsonStr = item.replace(/'/g, '"');
      try {
        const json = JSON.parse(jsonStr);
        res[key] = json;
      } catch {
        res[key] = item;
      }
    }
  }
  return res;
};
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
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return res;
};
// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const config = parseConfig(env);
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-private-methods',
          ],
        },
      }),
    ],
    base: './',
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      host: '::',
      proxy: createProxy(config['VITE_PROXY'] || []),
    },
  };
});
