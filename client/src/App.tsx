import Description from "./components/Description";
import Title from "./components/Title";
import TodosContainer from "./components/TodosContainer";
import "./App.scss";

function App() {
  return (
    <main className="main">
      <Title />
      <Description />
      <TodosContainer />
    </main>
  );
}

export default App;
