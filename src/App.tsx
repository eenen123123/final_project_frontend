import "./App.css";
import AppRoute from "./AppRoute";
import Header from "./components/_deprecated/Header";
import NewHeader from "./components/Header/NewHeader";

function App() {
  return (
    <>
      {/* 이전 헤더 제거 */}
      {/* <Header /> */}
      <NewHeader />
      <AppRoute />
    </>
  );
}

export default App;
