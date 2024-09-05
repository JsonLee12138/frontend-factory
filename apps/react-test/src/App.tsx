import { useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { SelectIconPark } from 'jsonlee-ui-react';
import { SelectIconInstance } from 'jsonlee-ui-react/src/types/index';
import 'jsonlee-ui-react/dist/styles/style.css';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, _setCount] = useState(0);
  const selectRef = useRef<SelectIconInstance>(null);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => selectRef.current?.open()}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <SelectIconPark ref={selectRef} />
    </>
  );
}

export default App;
