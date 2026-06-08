import "./App.css";
import AppRoute from "./AppRoute";
import NewHeader from "./components/Header/NewHeader";
import { useLocation } from "react-router-dom";

function App() {
  const { pathname } = useLocation();
  const hideHeader = pathname.startsWith("/classroom/");

  return (
    <>
      {!hideHeader && <NewHeader />}
      <AppRoute />
    </>
  );
}

export default App;
