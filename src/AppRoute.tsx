import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./auth/ProtectedRoute";
import MyPage from "./pages/User/MyPage";
import ProtectedRouteAdmin from "./auth/ProtectedRouteAdmin";
import AdminPage from "./pages/Admin/AdminPage";
import Login from "./pages/User/Login";
import SignUp from "./pages/User/SignUp";
import TestPage from "./pages/test/TestPage";
import FileUploadTest from "./pages/test/FileUploadTest";
import KakaoPayTestPage from "./pages/test/kakao/KakaoPayTestPage";
import TossPaySuccessTestPage from "./pages/test/toss/TossPaySuccessTestPage";
import TossPayFailTestPage from "./pages/test/toss/TossPayFailTestPage";
import TossPayTestPage from "./pages/test/toss/TossPayTestPage";
import BuyProduct from "./pages/test/BuyProduct";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/test/editor" element={<TestPage />} />
      <Route path="/test/upload" element={<FileUploadTest />} />
      <Route path="/test/kakao-pay" element={<KakaoPayTestPage />} />

      <Route path="/test/buy" element={<BuyProduct />} />
      <Route path="/test/toss-pay" element={<TossPayTestPage />} />
      <Route
        path="/test/toss-pay/success"
        element={<TossPaySuccessTestPage />}
      />
      <Route path="/test/toss-pay/fail" element={<TossPayFailTestPage />} />

      {/* 인증이 필요한 라우트 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/mypage" element={<MyPage />} />
      </Route>

      {/* 관리자 전용 라우트 */}
      <Route element={<ProtectedRouteAdmin />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
