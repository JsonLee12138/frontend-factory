import { Component } from "react";
import "./App.css";
import { autoBind } from "jsonlee-decorator/src";
import Router from './router/Router.tsx';
import { Provider } from 'react-redux';
import store from './store';

@autoBind
class App extends Component<unknown, unknown> {
  state = {
    count: 0,
  };
  setCount(value: number) {
    this.setState({ count: value });
  }
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;
