import { storeUseType as store } from '@/store';

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type MapStateToProps<T> = (state: RootState) => T;

export type ConnectedProps<SP = unknown, DP = unknown, T = unknown> = Partial<SP & DP> & T;
