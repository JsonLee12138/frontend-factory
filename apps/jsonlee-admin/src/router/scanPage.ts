import { RouterItem } from '@/types/router';
import { camelCase } from 'jsonlee-utils';
import { ComponentType, lazy } from 'react';

export const modules = import.meta.glob('../pages/scan/**/index.tsx');

export const routeModules = Object.keys(modules).map(
  (key) => key.split('pages')[1],
);

export const genRoutes = () => {
  const res: RouterItem[] = [
    {
      path: '/',
      name: 'layout',
      component: lazy(() => import('@/component/Layout')),
      children: [],
    },
  ];
  for (const key in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, key)) {
      const element = modules[key];
      const path = key
        .replace('../pages/scan', '')
        .replace('/index.tsx', '')
        .replace('/Layout', '');
      const component = lazy(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        () => element() as Promise<{ default: ComponentType<any> }>,
      );
      const routerItem: RouterItem = {
        path,
        name: camelCase(path.split('/').filter(Boolean).join('-')),
        component,
      };
      if (key.includes('Layout')) {
        res[0]!.children!.push(routerItem);
      } else {
        res.push(routerItem);
      }
    }
  }
  return res;
};
