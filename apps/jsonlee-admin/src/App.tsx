import { useEffect } from 'react';
import Router from './router/Router.tsx';
import emitter from '@/utils/emitter.ts';
import { EmitterEvents } from '@/enum/emitter.ts';
import { setLoading, clearLoading } from '@/store/modules/loading.ts';
import { useAppDispatch } from './hooks/store.ts';

const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    emitter.on(EmitterEvents.SET_LOADING, () => {
      dispatch(setLoading());
    });
    emitter.on(EmitterEvents.CLEAR_LOADING, () => {
      dispatch(clearLoading());
    });
    return () => {
      emitter.off(EmitterEvents.SET_LOADING);
      emitter.off(EmitterEvents.CLEAR_LOADING);
    };
  }, []);

  return <Router />;
};

export default App;
