import { Button, Space, Tooltip } from 'antd';
import Icon from '../IconPark';
import { ToolBarProps } from '@/types/protable';
import { useContext, useMemo } from 'react';
import { context } from '@/component/ProTable/context';

const ToolBar = ({
  tools = ['refresh', 'column', 'searchToggle'],
}: ToolBarProps) => {
  // state
  // const loading = useAppSelector((state) => state.loading.loading);
  const { loading, showSearch, setShowSearch, refresh } = useContext(context)!;
  const showSearchLabel = useMemo<string>(() => {
    return showSearch ? '隐藏搜索' : '显示搜索';
  }, [showSearch]);
  // function
  // useEffect
  if (!tools) return <></>;
  return (
    <Space className={'pb-3'}>
      {tools.map((tool) => {
        switch (tool) {
          case 'searchToggle':
            return (
              <Tooltip title={showSearchLabel} key={`tool-${tool}`}>
                <Button
                  shape="circle"
                  onClick={setShowSearch.toggle}
                  icon={<Icon name={'search'} />}
                />
              </Tooltip>
            );
          case 'column':
            return (
              <Tooltip title="列设置" key={`tool-${tool}`}>
                <Button
                  shape="circle"
                  icon={<Icon name={'setting-config'} />}
                />
              </Tooltip>
            );
          case 'refresh':
            return (
              <Tooltip title="刷新" key={`tool-${tool}`}>
                <Button
                  loading={loading}
                  shape="circle"
                  onClick={refresh}
                  icon={<Icon name={'refresh'} />}
                />
              </Tooltip>
            );
          default:
            return null;
        }
      })}
    </Space>
  );
};

export default ToolBar;
