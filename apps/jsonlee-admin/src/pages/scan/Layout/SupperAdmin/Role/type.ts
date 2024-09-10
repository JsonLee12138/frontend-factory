import { RoleCreateDTO, RoleUpdateDTO } from '@/types/api_modules/role';

export interface EditModalRef {
  open: (title: string, data?: Partial<RoleCreateDTO | RoleUpdateDTO>) => void;
  close: () => void;
}
