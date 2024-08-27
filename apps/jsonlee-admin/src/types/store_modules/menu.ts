import { Menu } from '@/types/api_modules/menu.ts';

export interface MenuState {
  tree: Menu.Item[];
  flattenList: Menu.Item[];
}
