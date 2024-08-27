import { ComponentProps, ComponentType, ForwardedRef, forwardRef as forwardRefFunc } from 'react';

interface WithForwardRefProps<C> {
  ref: ForwardedRef<C>;
}

type WithoutForwardRouterProps<P> = Omit<P, keyof WithForwardRefProps<unknown>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const forwardRef = <C extends ComponentType<any>>(Component: C) => {
  type Props = ComponentProps<C>;
  const RenderedComponent = Component as ComponentType<WithoutForwardRouterProps<Props> & WithoutForwardRouterProps<C>>;
  const WithForwardRefComponent = forwardRefFunc((props: Props, ref: React.ForwardedRef<C>) => {
    return <RenderedComponent {...props} ref={ref} />;
  });
  return WithForwardRefComponent as unknown as (ComponentType<WithoutForwardRouterProps<Props> & WithForwardRefProps<C>> & C);
};
