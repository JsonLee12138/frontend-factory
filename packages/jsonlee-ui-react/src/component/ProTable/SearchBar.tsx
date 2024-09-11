import { SearchBarProps } from '@/types/protable';
import { useCallback, useContext, useMemo } from 'react';
import { FormFieldItem } from '@/types/form';
import Form from '@/component/Form';
import { Button, Space } from 'antd';
import Icon from '../IconPark';
import { context } from '@/component/ProTable/context';
import { AnyObject } from 'antd/es/_util/type';

const SearchBar = <P = AnyObject,>({ fields }: SearchBarProps) => {
  // state
  const { loading, getTableList, setPagination, getParams, setParams } =
    useContext(context)!;

  const handleReset = useCallback(() => {
    setPagination({ current: 1, pageSize: 10, total: 0 });
    requestAnimationFrame(() => {
      getTableList(getParams());
    });
    setParams({});
  }, [getParams, getTableList, setPagination, setParams]);
  const searchFields = useMemo<FormFieldItem[]>(
    () => [
      ...fields,
      {
        uniqueKey: 'search-buttons',
        colon: false,
        component: () => (
          <Space>
            <Button
              loading={loading}
              key={'searchbar-reset'}
              htmlType={'reset'}
              onClick={handleReset}
              icon={<Icon name={'undo'} />}
            >
              重置
            </Button>
            <Button
              loading={loading}
              key={'searchbar-submit'}
              htmlType={'submit'}
              type={'primary'}
              onClick={() => console.log('search')}
              icon={<Icon name={'search'} />}
            >
              查询
            </Button>
          </Space>
        ),
      },
    ],
    [fields, handleReset, loading],
  );
  // function
  const handleSearch = useCallback(
    (values: P) => {
      setPagination({ current: 1, pageSize: 10, total: 0 });
      requestAnimationFrame(() => {
        getTableList(getParams(values));
      });
      setParams(values);
    },
    [getParams, getTableList, setPagination, setParams],
  );
  // useEffect
  return <Form colon={true} fields={searchFields} onSubmit={handleSearch} />;
};

export default SearchBar;
