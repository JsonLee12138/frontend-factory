import { routeModules } from '@/router/scanPage';
import { useSafeState } from 'ahooks';
import { AutoComplete } from 'antd';
import type { AutoCompleteProps } from 'antd';
import { useCallback } from 'react';

const initOptions: AutoCompleteProps['options'] = routeModules.map((item) => ({
  label: item,
  value: item,
}));

const PageFilePathInput = ({ value, onChange }: AutoCompleteProps) => {
  const [options, setOptions] =
    useSafeState<AutoCompleteProps['options']>(initOptions);
  const handleOnSearch = useCallback(
    (value: string) => {
      const _opts = routeModules
        .filter((item) => item.includes(value))
        .map((item) => ({
          label: item,
          value: item,
        }));
      setOptions(_opts);
    },
    [setOptions],
  );
  return (
    <AutoComplete
      value={value}
      onChange={onChange}
      options={options}
      onSearch={handleOnSearch}
      placeholder={'请输入文件路径'}
    />
  );
};

export default PageFilePathInput;
