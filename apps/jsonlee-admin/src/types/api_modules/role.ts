import { RoleDataScope } from '@/enum/dic';

export interface RoleItem {
  id: number;
  name: number;
  defaultRouter: string;
  parentId: number;
  dataScope: RoleDataScope;
  children: RoleItem[];
}

export type RoleCreateDTO = Omit<RoleItem, 'id' | 'children'>;

export type RoleUpdateDTO = Omit<RoleItem, 'children'>;
