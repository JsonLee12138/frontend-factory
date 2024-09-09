import { RouterItem } from '../types/router';
import { lazy } from 'react';
import { genRoutes } from './scanPage';

export const dynamicRoutes: RouterItem[] = genRoutes();

console.log(dynamicRoutes, '>>>');

export const whiteRoutes: string[] = ['signin', '403', '404', 'layout'];

export const staticRoutes: RouterItem[] = [
  {
    path: '/signin',
    name: 'signin',
    component: lazy(() => import('@/pages/Singin')),
    meta: {
      title: '登录',
    },
  },
  ...dynamicRoutes,
  {
    path: '/403',
    component: lazy(() => import('@/pages/ForbiddenPage')),
    name: '403',
    meta: {
      title: '403',
    },
  },
  {
    path: '*',
    component: lazy(() => import('@/pages/PageNotFound')),
    name: '404',
    meta: {
      title: '404',
    },
  },
];
