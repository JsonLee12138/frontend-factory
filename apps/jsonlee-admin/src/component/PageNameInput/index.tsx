import { dynamicRoutes } from '@/router';
import { useSafeState } from 'ahooks';
import { AutoComplete } from 'antd';
import type { AutoCompleteProps } from 'antd';
import { treeFlatten } from 'jsonlee-utils';
import { useCallback } from 'react';

const initOptions: AutoCompleteProps['options'] = treeFlatten(
  dynamicRoutes,
).map((item) => ({
  label: item.name,
  value: item.name,
}));

const PageNameInput = ({ value, onChange }: AutoCompleteProps) => {
  const [options, setOptions] =
    useSafeState<AutoCompleteProps['options']>(initOptions);
  const handleOnSearch = useCallback(
    (value: string) => {
      const _opts = initOptions.filter((item) =>
        (item.value as string).includes(value),
      );
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
      placeholder={'请输入路由名称'}
    />
  );
};

export default PageNameInput;
