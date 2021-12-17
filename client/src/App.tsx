import { StoreProvider } from "easy-peasy";
import "./App.scss";

import Main from "./components/Main";
import store from "./store";
function App() {
  return (
    <StoreProvider store={store}>
      <Main />
    </StoreProvider>
  );
}

export default App;
