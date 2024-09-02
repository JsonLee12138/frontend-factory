import type { TreeSelectProps as ATreeSelectProps } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';

export interface TreeSelectProps<T = DefaultOptionType>
  extends ATreeSelectProps {
  width?: number | string;
  labelKey?: string;
  valueKey?: string;
  childrenKey?: string;
  options: T[];
}
