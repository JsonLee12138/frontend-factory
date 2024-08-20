import { Route, BrowserRouter as BRouter, Routes } from 'react-router-dom';
import { staticRoutes } from './index.ts';
import { Component } from 'react';

class Router extends Component {
  render() {
    return <BRouter>
      <Routes>
      {staticRoutes.map((item) => {
        const Component = item.component;
        return <Route key={item.name} element={<Component />} path={item.path} />;
      })}
      </Routes>
    </BRouter>;
  }
}

export default Router;
