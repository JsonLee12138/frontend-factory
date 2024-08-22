import { Component } from 'react';
import { autoBind } from 'jsonlee-decorator/src';
import Router from './router/Router.tsx';
import emitter from '@/utils/emitter.ts';
import { EmitterEvents } from '@/enum/emitter.ts';
import { connect } from '@/decorator/connect.ts';
import { setLoading, clearLoading } from '@/store/modules/loading.ts';
import { ConnectedProps, RootState } from './types/store.ts';

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
const mapDispatchToProps = {
  setLoading,
  clearLoading,
};

type FinalProps = ConnectedProps<StoreStateProps, StoreDispatchProps, object>;

@connect<StoreStateProps>(mapStateToProps, mapDispatchToProps)
@autoBind
class App extends Component<FinalProps> {
  state = {
    count: 0,
  };

  constructor(props: FinalProps) {
    super(props);
    emitter.on(EmitterEvents.SET_LOADING, () => {
      this.props.setLoading!();
    });
    emitter.on(EmitterEvents.CLEAR_LOADING, ()=> {
      this.props.clearLoading!()
    })
  }

  componentWillUnmount() {
    emitter.off(EmitterEvents.SET_LOADING);
    emitter.off(EmitterEvents.CLEAR_LOADING);
  }

  setCount(value: number) {
    this.setState({ count: value });
  }

  render() {
    return <Router />;
  }
}

export default App;
