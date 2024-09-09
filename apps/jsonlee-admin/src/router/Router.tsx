import { BrowserRouter as BRouter, Route, Routes } from 'react-router-dom';
import { staticRoutes } from './index';
import { Suspense, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { getMenuData } from '@/store/modules/menu';
import AuthRoute from './AuthRoute';
import Loading from '@/component/Loading';

const Router = () => {
  const dispatch = useAppDispatch();
  const isLoaded = useAppSelector((state) => state.menu.flag);

  useEffect(() => {
    dispatch(getMenuData());
  }, []);
  return isLoaded ? (
    <BRouter>
      <Suspense fallback={<Loading open={true} />}>
        <Routes>
          {staticRoutes.map((item) => {
            return (
              <Route
                key={item.name}
                element={<AuthRoute {...item} />}
                path={item.path}
              >
                {item.children?.map((child) => {
                  return (
                    <Route
                      key={child.name}
                      element={<AuthRoute {...child} />}
                      path={child.path}
                    />
                  );
                })}
              </Route>
            );
          })}
        </Routes>
      </Suspense>
    </BRouter>
  ) : (
    <Loading open={true} />
  );
};

export default Router;
