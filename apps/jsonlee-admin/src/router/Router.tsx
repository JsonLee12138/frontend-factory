import { Route, BrowserRouter as BRouter, Routes } from 'react-router-dom';
import { staticRoutes } from './index.ts';
import { Suspense } from 'react';

const Router = () => {
  return (
    <BRouter>
      <Suspense fallback={<div>loading...</div>}>
        <Routes>
          {staticRoutes.map((item) => {
            const Component = item.component;
            return (
              <Route key={item.name} element={<Component />} path={item.path}>
                {item.children?.map((child) => {
                  const Child = child.component;
                  return (
                    <Route
                      key={child.name}
                      element={<Child />}
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
  );
};

export default Router;
