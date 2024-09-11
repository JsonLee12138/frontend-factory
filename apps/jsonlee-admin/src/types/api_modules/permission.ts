export interface PermissionItem {
  id: number;
  name: string;
  desc: string;
  group: string;
}

export type PermissionCreateDTO = Omit<PermissionItem, 'id'>;

export type PermissionUpdateDTO = PermissionItem;
