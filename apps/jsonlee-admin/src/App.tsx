import { useEffect } from 'react';
import Router from './router/Router';
import emitter from '@/utils/emitter';
import { EmitterEvents } from '@/enum/emitter';
import { setLoading, clearLoading } from '@/store/modules/loading';
import { useAppDispatch } from './hooks/store';

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

  return (
    <>
      <Router />
    </>
  );
};

export default App;
