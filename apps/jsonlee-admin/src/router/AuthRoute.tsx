import { useAuthMenu } from '@/hooks/useAuthMenu';
import { RouterItem } from '@/types/router';
import { useMemo } from 'react';
import { whiteRoutes } from '.';
import Redirect from './Redirect';

const AuthRoute = ({ component: Component, name }: RouterItem) => {
  const auth = useAuthMenu(name);
  const render = useMemo(() => {
    if (auth || whiteRoutes.includes(name)) {
      return <Component />;
    }
    return <Redirect to={'/403'} />;
  }, [Component, auth, name]);
  return render;
};

export default AuthRoute;
