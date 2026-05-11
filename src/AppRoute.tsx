import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./auth/ProtectedRoute";
import MyPage from "./pages/User/MyPage";
import ProtectedRouteAdmin from "./auth/ProtectedRouteAdmin";
import AdminPage from "./pages/Admin/AdminPage";
import AuthRequestTestPage from "./auth/test/AuthRequestTestPage";
import Login from "./pages/User/Login";
import SignUp from "./pages/User/SignUp";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/test" element={<AuthRequestTestPage />} />
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
