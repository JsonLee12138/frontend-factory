import { MenuItem } from '../api_modules/menu';

export interface MenuState {
  tree: MenuItem[];
  flattenList: MenuItem[];
  flag: boolean;
}
