import { Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './styles/antd.scss';
import { Provider } from 'react-redux';
import store, { persistor } from './store/index';
import '@icon-park/react/styles/index.css';
import { EmitterEvents } from '@/enum/emitter';
import emitter from '@/utils/emitter';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

window.onresize = () => {
  emitter.emit(EmitterEvents.RESIZE);
};

createRoot(document.getElementById('root')!).render(
  <Fragment>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </Fragment>,
);
