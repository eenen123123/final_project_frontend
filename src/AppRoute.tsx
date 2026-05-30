import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ClassroomPage from "./pages/Classroom/ClassroomPage";
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
import OnlineLecturePage from "./pages/Onlinelecture/OnlineLecturePage";
import ClassroomLayout from "./layouts/ClassroomLayout";

import NoticePage from "./pages/ServiceCenter/Notice/NoticePage";
import ServiceCenterPage from "./pages/ServiceCenter/ServiceCenterPage";
import FAQPage from "./pages/ServiceCenter/FAQ/FAQPage";
import FaqDetailPage from "./pages/ServiceCenter/FAQ/FaqDetailPage";
import QnAPage from "./pages/ServiceCenter/QnA/QnAPage";
import NoticeDetailPage from "./pages/ServiceCenter/Notice/NoticeDetailPage";
import QnaWritePage from "./pages/ServiceCenter/QnA/QnaWritePage";
import QnaDetailPage from "./pages/ServiceCenter/QnA/QnaDetailPage";
import QnaEditPage from "./pages/ServiceCenter/QnA/QnaEditPage";

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
      <Route path="/test/toss-pay/success" element={<TossPaySuccessTestPage />} />
      {/* 공용 라우트 */}
      <Route path="/test/toss-pay/fail" element={<TossPayFailTestPage />} />

      {/* 고객센터 라우트 */}
      <Route path="/customer/faq" element={<FAQPage />} />
      <Route path="/customer/faq/:postSn" element={<FaqDetailPage />} />
      <Route path="/customer/notice" element={<NoticePage />} />
      <Route path="/customer/notice/:postSn" element={<NoticeDetailPage />} />
      <Route path="/customer/qna" element={<QnAPage />} />
      <Route path="/customer/qna/:postSn" element={<QnaDetailPage />} />
      <Route path="/customer/*" element={<ServiceCenterPage />} />

      {/* 인증이 필요한 라우트 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/classroom/:classId" element={<ClassroomPage />} />
        <Route path="/mylecture" element={<OnlineLecturePage />} />
        <Route path="/customer/qna/write" element={<QnaWritePage />} />
        <Route path="/customer/qna/my" element={<QnAPage myOnly />} />
        <Route path="/customer/qna/:postSn/edit" element={<QnaEditPage />} />
      </Route>

      {/* 관리자 전용 라우트 */}
      <Route element={<ProtectedRouteAdmin />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
