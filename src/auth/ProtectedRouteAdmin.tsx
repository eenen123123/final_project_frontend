import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRouteAdmin() {
  const { isAuthReady, isAuthenticated, getRole } = useAuth();

  // 인증 상태가 아직 준비되지 않은 경우 로딩 메시지 표시
  if (!isAuthReady) {
    return <div>인증 상태를 확인 중입니다...</div>;
  }

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 관리자가 아닌 사용자는 접근 불가 페이지로 리다이렉트
  if (getRole() !== "ROLE_ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  // 인증된 관리자에게만 Outlet을 렌더링하여 자식 라우트로 이동할 수 있도록 허용
  // Outlet은 중첩된 라우트의 컴포넌트를 렌더링하는 역할을 한다.
  return <Outlet />;
}
