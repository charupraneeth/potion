import { StoreProvider } from "easy-peasy";
import "./App.scss";

import MainContainer from "./components/MainContainer";
import store from "./store";
function App() {
  return (
    <StoreProvider store={store}>
      <MainContainer />
    </StoreProvider>
  );
}

export default App;
