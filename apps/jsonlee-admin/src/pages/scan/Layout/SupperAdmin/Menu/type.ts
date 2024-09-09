import { MenuCreateDTO, MenuUpdateDTO } from '@/types/api_modules/menu';

export interface EditModalRef {
  open: (title: string, data?: Partial<MenuUpdateDTO | MenuCreateDTO>) => void;
  close: () => void;
}
