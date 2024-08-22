import store from '@/store';

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type MapStateToProps<T> = (state: RootState) => T;

export type ConnectedProps<SP = never, DP = never, T = never> = Partial<SP & DP> & T;
