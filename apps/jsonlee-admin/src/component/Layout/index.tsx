import { Component } from 'react';
import { Layout as AntdLayout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';
import { autoBind } from 'jsonlee-decorator/src';
import Icon from '@icon-park/react/es/all';
import { treeBind, treeOmit } from '@/utils/tree';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';

const { Header, Footer, Sider, Content } = AntdLayout;

const items = [
  {
    id: '1',
    icon: 'system',
    label: '超级管理员',
  },
  {
    id: '2',
    parentId: '1',
    icon: 'application-menu',
    label: '菜单管理'
  },
  {
    id: '3',
    parentId: '1',
    icon: 'peoples',
    label: '用户管理'
  },
  {
    id: '4',
    parentId: '1',
    icon: 'personal-privacy',
    label: '角色管理'
  }
]

interface ILayoutState {
  collapsed: boolean;
}

@autoBind
export class Layout extends Component<unknown, ILayoutState> {
  state = {
    collapsed: false,
  };
  get menus(){
    return treeOmit(treeBind(items.map(item=> ({
      ...item,
      key: item.id,
      icon: item.icon ? <Icon type={item.icon} /> : null,
    }))), ['parentId']) as unknown as ItemType<MenuItemType>[]
  }
  collapsedToggle() {
    this.setState((prev) => ({
      collapsed: !prev.collapsed,
    }));
  }
  componentDidMount(): void {
  }
  render() {
    return (
      <>
        <AntdLayout className={'h-screen'}>
          <Sider
            width={200}
            collapsedWidth={60}
            theme="light"
            className={'shadow'}
            collapsed={this.state.collapsed}
          >
            <div
              className={
                'h-14 flex justify-center items-center font-bold dark:text-white'
              }
            >
              <h1 className={'text-lg'}>Json Admin</h1>
            </div>
            <Menu
              items={this.menus}
              mode="inline"
              theme="light"
            />
          </Sider>
          <AntdLayout>
            <Header
              className={
                'h-14 flex justify-between bg-white shadow items-center px-4 py-0'
              }
            >
              <Icon type={this.state.collapsed ? 'menu-fold-one' : 'menu-unfold-one'} className="text-xl" onClick={this.collapsedToggle} />
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
              <a
                href="https://github.com/JsonLee12138"
                className={'text-black'}
              >
                Json Lee
              </a>
              .
            </Footer>
          </AntdLayout>
        </AntdLayout>
      </>
    );
  }
}

export default Layout;
