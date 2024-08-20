import { RouterItem } from '../types/router.ts';
import PageNotFound from '../pages/PageNotFound';
import ForbiddenPage from '../pages/ForbiddenPage';
import Singin from '../pages/Singin';

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


