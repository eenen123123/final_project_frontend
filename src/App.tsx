import "./App.css";
import AppRoute from "./AppRoute";
import Header from "./components/Header";
import NewHeader from "./components/Header/NewHeader";

function App() {
  return (
    <>
      <Header />
      <NewHeader/>
      <AppRoute />
    </>
  );
}

export default App;
