import { AnyObject } from '@/types/global';
import { TreeProps as ATreeProps } from 'antd';
import { ArrTransformFormat } from 'jsonlee-utils/dist/types/arr';
import { Key } from 'react';

export interface TreeProps<T = AnyObject> extends ATreeProps<T> {
  checked?: Key[];
  optionsFormat?: ArrTransformFormat<T>;
  onCheckedAllChange?: (checked: boolean) => void;
}

export interface CheckedValue {
  checked: Key[];
  halfChecked: Key[];
}

export interface TreeInstance {
  getCheckedKeys: () => CheckedValue;
  expandAll: () => void;
  collapseAll: () => void;
  checkAll: () => void;
  unCheckAll: () => void;
}
