import { Component } from 'react';
import { autoBind } from 'jsonlee-decorator/src';
import Router from './router/Router.tsx';
import emitter from '@/utils/emitter.ts';
import { EmitterEvents } from '@/enum/emitter.ts';
import { connect } from '@/decorator/connect.ts';
import { setLoading, clearLoading } from '@/store/modules/loading.ts';
import { AppDispatch, ConnectedProps, RootState } from './types/store.ts';

interface StoreStateProps {
  loading: boolean;
}

interface StoreDispatchProps {
  setLoading: () => void;
  clearLoading: () => void;
}


const mapStateToProps = (state: RootState) => ({
  loading: state.loading.loading,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setLoading: () => dispatch(setLoading()),
  clearLoading: () => dispatch(clearLoading()),
});

type CounterClassProps = ConnectedProps<StoreStateProps, StoreDispatchProps, object>;
@connect<StoreStateProps>(mapStateToProps, mapDispatchToProps)
@autoBind
class App extends Component<CounterClassProps> {
  state = {
    count: 0,
  };

  constructor(props: CounterClassProps) {
    super(props);
    emitter.on(EmitterEvents.SET_LOADING, () => {
      this.props.setLoading!();
      console.log(1);
    });
  }

  componentWillUnmount() {
    emitter.off(EmitterEvents.SET_LOADING);
  }

  setCount(value: number) {
    this.setState({ count: value });
  }

  render() {
    return <Router />;
  }
}

export default App;
