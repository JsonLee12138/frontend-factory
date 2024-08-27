import { Menu } from "@/types/api_modules/menu";

export interface EditModalRef {
  open: (title: string, data?:Partial<Menu.UpdateDTO | Menu.CreateDTO>) => void;
  close: ()=> void;
}
