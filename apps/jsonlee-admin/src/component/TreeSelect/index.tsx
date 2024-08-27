import { useMemo } from 'react';
import { TreeSelectProps } from './type.ts';
import { TreeSelect as ATreeSelect } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { arrTransform } from '@/utils/arr.ts';

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
      true
    );
  }, []);
  return (
    <ATreeSelect
      {...props}
      style={{ width: width }}
      treeData={treeData as any}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default TreeSelect;
