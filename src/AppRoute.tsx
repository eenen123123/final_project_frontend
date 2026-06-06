import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ClassroomPage from "./pages/Classroom/ClassroomPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import MyPage from "./pages/User/Mypage/MyPage";
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
import NoticePage from "./pages/ServiceCenter/Notice/NoticePage";
import ServiceCenterPage from "./pages/ServiceCenter/ServiceCenterPage";
import FAQPage from "./pages/ServiceCenter/FAQ/FAQPage";
import FaqDetailPage from "./pages/ServiceCenter/FAQ/FaqDetailPage";
import QnAPage from "./pages/ServiceCenter/QnA/QnAPage";
import NoticeDetailPage from "./pages/ServiceCenter/Notice/NoticeDetailPage";
import QnaWritePage from "./pages/ServiceCenter/QnA/QnaWritePage";
import QnaDetailPage from "./pages/ServiceCenter/QnA/QnaDetailPage";
import QnaEditPage from "./pages/ServiceCenter/QnA/QnaEditPage";
import DataRoomPage from "./pages/ServiceCenter/DataRoom/DataRoomPage";
import DataRoomDetailPage from "./pages/ServiceCenter/DataRoom/DataRoomDetailPage";
import VerifyPasswordPage from "./pages/User/VerifyPasswordPage";
import NotFound from "./pages/NotFound";
import MyLecturePage from "./pages/User/Mypage/MyLecturePage";
import ProfileEditPage from "./pages/User/Mypage/ProfileEditPage";
import DummyPage from "./pages/User/Mypage/dummy";
import LectureEnrollPage from "./pages/User/Mypage/LectureEnrollPage";
import BookOrderPage from "./pages/User/Mypage/BookOrderPage";
import LectureHistoryPage from "./pages/User/Mypage/LectureHistoryPage";
import MyCalendarPage from "./pages/User/Mypage/MyCalendarPage";
import CartPage from "./pages/User/Mypage/CartPage";
import Instructors from "./pages/Header/Instructors.tsx";
import OrderHistoryPage from "./pages/User/Mypage/OrderHistoryPage";
import CouponPointPage from "./pages/User/Mypage/CouponPointPage";
import BookMain from "./pages/Header/Books.tsx";

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
      {/* 공용 라우트 */}
      <Route path="/test/toss-pay/fail" element={<TossPayFailTestPage />} />
      <Route path="/header/instructors" element={<Instructors />} />
      <Route path="/header/books" element={<BookMain />} />

      {/* 고객센터 라우트 */}
      <Route path="/customer/faq" element={<FAQPage />} />
      <Route path="/customer/faq/:postSn" element={<FaqDetailPage />} />
      <Route path="/customer/notice" element={<NoticePage />} />
      <Route path="/customer/notice/:postSn" element={<NoticeDetailPage />} />
      <Route path="/customer/qna" element={<QnAPage />} />
      <Route path="/customer/qna/:postSn" element={<QnaDetailPage />} />
      <Route path="/customer/resource" element={<DataRoomPage />} />
      <Route
        path="/customer/resource/:postSn"
        element={<DataRoomDetailPage />}
      />
      <Route path="/customer/*" element={<ServiceCenterPage />} />
      <Route path="/dummy" element={<DummyPage />} />

      {/* 인증이 필요한 라우트 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mycalendar" element={<MyCalendarPage />} />
        <Route path="/mylecture" element={<MyLecturePage />} />
        <Route path="/mypage/verify" element={<VerifyPasswordPage />} />
        <Route path="/mypage/profile/edit" element={<ProfileEditPage />} />
        <Route path="/classroom/:classId" element={<ClassroomPage />} />
        <Route path="/customer/qna/write" element={<QnaWritePage />} />
        <Route path="/customer/qna/my" element={<QnAPage myOnly />} />
        <Route path="/customer/qna/:postSn/edit" element={<QnaEditPage />} />
        <Route path="/enroll" element={<LectureEnrollPage />} />
        <Route path="/mylecture/book" element={<BookOrderPage />} />
        <Route path="/mylecture/history" element={<LectureHistoryPage />} />
        <Route path="/mycart" element={<CartPage />} />
        <Route path="/mycart/orderhistory" element={<OrderHistoryPage />} />
        <Route path="/mypage/couponpoint" element={<CouponPointPage />} />
      </Route>

      {/* 관리자 전용 라우트 */}
      <Route element={<ProtectedRouteAdmin />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
