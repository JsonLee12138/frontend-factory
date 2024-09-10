import { useMemo } from 'react';
import { TreeSelectProps } from '@/types/treeSelect';
import {
  TreeSelect as ATreeSelect,
  type TreeSelectProps as ATreeSelectProps,
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { arrTransform } from 'jsonlee-utils';

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
  }, [childrenKey, labelKey, options, valueKey]);
  return (
    <ATreeSelect
      {...props}
      style={{ width: width }}
      className={'w-full'}
      treeData={treeData as ATreeSelectProps['treeData']}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default TreeSelect;
