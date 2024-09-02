import { MenuParamsType } from '@/enum/dic.ts';

export namespace Menu {
  export interface Item {
    id: number;
    name: string;
    path: string;
    component: string;
    sort: number;
    params: Params[];
    meta: Meta;
    parentId: number | null;
    children: Item[];
  }
  export interface Meta {
    title: string;
    icon: string;
    keepAlive: boolean;
    hidden: boolean;
  }
  export interface Params {
    menuId: number;
    type: MenuParamsType;
    key: string;
  }
  export type CreateDTO = Omit<Item, 'id' | 'children'>;
  export type UpdateDTO = Omit<Item, 'children'>;
}
