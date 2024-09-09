import { Layout as AntdLayout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { useBoolean, useSafeState } from 'ahooks';
import { useCallback, useEffect, useMemo } from 'react';
import { IconPark } from 'jsonlee-ui-react';
import { useAppSelector } from '@/hooks/store';
import { MenuItem } from '@/types/api_modules/menu';
import Icon from '../Icon';
import { arrTransform, treeOmit } from 'jsonlee-utils';

const { Header, Footer, Sider, Content } = AntdLayout;

const Layout = () => {
  const [collapsed, { toggle: collapsedToggle }] = useBoolean(false);
  const navigate = useNavigate();
  const menuTree = useAppSelector((state) => state.menu.tree);
  const menuList = useAppSelector((state) => state.menu.flattenList);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useSafeState<string>(location.pathname);
  const [selectedKeys, setSelectKeys] = useSafeState<string[]>([]);
  const [openKeys, setOpenKeys] = useSafeState<string[]>([]);

  useEffect(() => {
    const crrentMenu = menuList.find((item) => item.path === currentPath);
    if (crrentMenu) {
      setSelectKeys([crrentMenu.id?.toString() || '']);
      setOpenKeys([crrentMenu.parentId?.toString() || '']);
    } else {
      setSelectKeys([]);
      setOpenKeys([]);
    }
  }, [currentPath, menuList]);

  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ key }: any) => {
      const currentMenu = menuList.find((item) => item.id === parseInt(key));
      if (currentMenu) {
        setCurrentPath(currentMenu.path);
        navigate(currentMenu.path);
      }
    },
    [menuList, navigate, setCurrentPath],
  );

  const handleOpenChange = useCallback(
    (keys: string[]) => {
      setOpenKeys(keys);
    },
    [setOpenKeys],
  );

  const menus = useMemo(
    () =>
      treeOmit<MenuItem>(
        arrTransform(
          menuTree,
          {
            label: 'meta.title',
            chilren: 'children',
            key: 'id',
            icon: (item: MenuItem) => <Icon name={item.meta.icon} />,
          },
          true,
        ),
        ['parentId'],
      ) as unknown as ItemType<MenuItemType>[],
    [menuTree],
  );

  return (
    <AntdLayout className={'h-screen'}>
      <Sider
        width={200}
        collapsedWidth={60}
        theme="light"
        className={'shadow'}
        collapsed={collapsed}
      >
        <div
          className={
            'h-14 flex justify-center items-center font-bold dark:text-white'
          }
        >
          <h1 className={'text-lg'}>Json Admin</h1>
        </div>
        <Menu
          items={menus}
          mode="inline"
          theme="light"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onClick={handleChange}
          onOpenChange={handleOpenChange}
        />
      </Sider>
      <AntdLayout>
        <Header
          className={
            'h-14 flex justify-between bg-white shadow items-center px-4 py-0'
          }
        >
          <IconPark
            name={collapsed ? 'menu-fold-one' : 'menu-unfold-one'}
            className="text-xl"
            onClick={collapsedToggle}
          />
        </Header>
        <Content className={'overflow-y-auto'}>{<Outlet />}</Content>
        <Footer className={'px-7 py-3 text-center text-gray-500 shadow'}>
          2024 ©{' '}
          <a
            href="https://github.com/JsonLee12138/frontend-factory/tree/main/apps/jsonlee-admin"
            className={'text-black'}
          >
            Json Admin
          </a>{' '}
          By{' '}
          <a href="https://github.com/JsonLee12138" className={'text-black'}>
            Json Lee
          </a>
          .
        </Footer>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
