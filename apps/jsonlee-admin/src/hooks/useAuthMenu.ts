import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { getMenuData } from '@/store/modules/menu';

export const useAuthMenu = (routeName: string): boolean => {
  const { flattenList: menuList, flag: getMenuFlag } = useAppSelector(
    (state) => state.menu,
  );
  const dispath = useAppDispatch();
  const flag = useMemo(() => {
    return !!menuList.find((item) => item.name === routeName);
  }, [menuList, routeName]);
  useEffect(() => {
    if (!getMenuFlag) {
      dispath(getMenuData());
    }
  }, [getMenuFlag]);
  return flag;
};
