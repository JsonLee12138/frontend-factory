import { RoleDataScope } from './../enum/dic';
export const RoleDataScopeTypes = [
  {
    label: '全部数据',
    value: RoleDataScope.ALL,
  },
  {
    label: '本角色数据',
    value: RoleDataScope.CUSTOM,
  },
  {
    label: '本角色及子角色数据',
    value: RoleDataScope.CUSTOM_AND_CHILDREN,
  },
];
