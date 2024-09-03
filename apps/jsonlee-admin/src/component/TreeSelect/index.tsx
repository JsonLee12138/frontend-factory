import { useMemo } from 'react';
import { TreeSelectProps } from './type';
import {
  TreeSelect as ATreeSelect,
  type TreeSelectProps as ATreeSelectProps,
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { arrTransform } from '@/utils/arr';

export interface TreeOptionItem {
  label: string;
  value: string | number;
  children: null | TreeOptionItem[] | undefined;
}

const TreeSelect = <T extends object = DefaultOptionType>({
  valueKey = 'value',
  labelKey = 'label',
  childrenKey = 'children',
  options,
  width,
  placeholder,
  value,
  onChange,
  ...props
}: TreeSelectProps<T>) => {
  const treeData = useMemo(() => {
    return arrTransform<T, TreeOptionItem>(
      options,
      {
        value: valueKey,
        label: labelKey,
        children: childrenKey,
      },
      true,
    );
  }, []);
  return (
    <ATreeSelect
      {...props}
      style={{ width: width }}
      treeData={treeData as ATreeSelectProps['treeData']}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default TreeSelect;
