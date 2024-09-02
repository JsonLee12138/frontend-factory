import type { ComponentProps, ComponentType } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export interface WithRouterProps {
  navigate?: NavigateFunction;
}

type WithoutRouterProps<T> = Omit<T, keyof WithRouterProps>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withRouter = <C extends ComponentType<any>>(Component: C) => {
  type Props = ComponentProps<C>;
  const WrappedComponent = (props: WithoutRouterProps<Props>) => {
    const navigate = useNavigate();
    const RenderedComponent = Component as ComponentType<
      WithoutRouterProps<Props> & WithRouterProps
    >;
    return <RenderedComponent {...props} navigate={navigate} />;
  };
  return WrappedComponent as unknown as ComponentType<
    WithoutRouterProps<Props> & WithRouterProps
  > &
    C;
};
