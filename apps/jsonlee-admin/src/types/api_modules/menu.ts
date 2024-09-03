import { MenuParamsType } from '@/enum/dic';

export interface MenuItem {
  id: number;
  name: string;
  path: string;
  component: string;
  sort: number;
  params: MenuParams[];
  meta: MenuMeta;
  parentId: number | null;
  children: MenuItem[];
}

export interface MenuMeta {
  title: string;
  icon: string;
  keepAlive: boolean;
  hidden: boolean;
}

export interface MenuParams {
  menuId: number;
  type: MenuParamsType;
  key: string;
}

export type MenuCreateDTO = Omit<MenuItem, 'id' | 'children'>;

export type MenuUpdateDTO = Omit<MenuItem, 'children'>;
