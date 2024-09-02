import { ConnectedProps, connect as reduxConnect } from 'react-redux';
import type { ComponentType, ComponentProps } from 'react';
import { MapStateToProps } from '@/types/store.ts';

export const connect = <SP = object, DP = object>(
  mapStateToProps?: MapStateToProps<SP>,
  mapDispatchToProps?: DP,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <C extends ComponentType<any>>(WrappedComponent: C) => {
    const connector = reduxConnect(mapStateToProps, mapDispatchToProps);
    type PropsFromRedux = ConnectedProps<typeof connector>;

    // 使用包装后的组件返回一个新的组件
    const ConnectedComponent = connector(WrappedComponent);

    // 重新定义组件的 props 类型
    type WrappedComponentProps = ComponentProps<C>;
    type FinalProps = Omit<WrappedComponentProps, keyof PropsFromRedux> &
      Partial<PropsFromRedux>;

    Object.assign(ConnectedComponent, WrappedComponent);

    return ConnectedComponent as unknown as ComponentType<FinalProps> & C;
  };
};
