import { RouterItem } from '../types/router.ts';
import PageNotFound from '@/pages/PageNotFound';
import ForbiddenPage from '@/pages/ForbiddenPage';
import Singin from '@/pages/Singin';
import Layout from '@/component/Layout';

export const staticRoutes: RouterItem[] = [
  {
    path: '/signin',
    name: 'signin',
    component: Singin,
    meta: {
      title: '登录',
    }
  },
  {
    path: '/layout',
    name: 'layout',
    component: Layout,
  },
  {
    path: '/403',
    component: ForbiddenPage,
    name: '403',
    meta: {
      title: '403',
    },
  },
  {
    path: '*',
    component: PageNotFound,
    name: '404',
    meta: {
      title: '404',
    },
  },
];
