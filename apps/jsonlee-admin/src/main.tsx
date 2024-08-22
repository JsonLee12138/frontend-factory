import { Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import store, { persistor } from './store/index.ts';
import '@icon-park/react/styles/index.css';
import { EmitterEvents } from '@/enum/emitter.ts';
import emitter from '@/utils/emitter.ts';
import { PersistGate } from 'redux-persist/integration/react';

window.onresize = () => {
  emitter.emit(EmitterEvents.RESIZE);
};

createRoot(document.getElementById('root')!).render(
  <Fragment>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </Fragment>,
);
