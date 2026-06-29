import "./App.css";
import AppRoute from "./AppRoute";
import NewHeader from "./components/Header/NewHeader";
import Footer from "./components/footer/Footer";
import { useLocation } from "react-router-dom";

function App() {
  const { pathname } = useLocation();
  const hideHeaderPaths = ["/classroom/", "/viewer", "/mypage/address-book", "/mypage/coupon-select", "/info/"]; // 이 경로들로 시작하는 경우 헤더 숨김
  const hideHeader = hideHeaderPaths.some((path) => pathname.startsWith(path));

  return (
    <>
      {!hideHeader && <NewHeader />}
      <AppRoute />
      {!hideHeader && <Footer />}
    </>
  );
}

export default App;
