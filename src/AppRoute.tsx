import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ClassroomPage from "./pages/Classroom/ClassroomPage";
import MyClassroomsPage from "./pages/Classroom/MyClassroomsPage";
import ClassroomLayout from "./layouts/ClassroomLayout";
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
import Instructors from "./pages/Instructor/InstructorsPage";
import InstructorDetailPage from "./pages/Instructor/InstructorDetailPage";
import InstructorBoardLayout from "./pages/Instructor/InstructorBoardLayout";
import CoursesTab from "./pages/Instructor/InstructorBoard/CoursesTab";
import BoardTab from "./pages/Instructor/InstructorBoard/BoardTab";
import BoardPostDetailPage from "./pages/Instructor/InstructorBoard/BoardPostDetailPage";
import CourseDetailPage from "./pages/Instructor/InstructorBoard/CourseDetailPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import OrderHistoryPage from "./pages/User/Mypage/OrderHistoryPage";
import CouponPointPage from "./pages/User/Mypage/CouponPointPage";
import BookMain from "./pages/Books/BooksPage";
import ParentPage from "./ParentPage/ParentPage.tsx";
import AiNavigator from "./pages/AiNavigator/AiNavigatorPage";
import LectureListPage from "./pages/Lecture/LectureListPage.tsx";
import ParentJoinPage from "./pages/User/ParentJoinPage.tsx";
import CourseListPage from "./pages/course/CourseListPage.tsx";
import CourseInfoPage from "./pages/course/CourseInfoPage.tsx";
import ViewerTestPage from "./pages/test/ViewerTestPage.tsx";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/parent/join" element={<ParentJoinPage />} />

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
      <Route path="/instructors" element={<Instructors />} />
      <Route path="/instructor/:instrUuid">
        <Route index element={<InstructorDetailPage />} />
        <Route element={<InstructorBoardLayout />}>
          <Route path="courses" element={<CoursesTab />} />
          <Route path="courses/:courseSn" element={<CourseDetailPage />} />
          <Route
            path="notice"
            element={
              <BoardTab key="notice" boardType="notice" title="공지사항" />
            }
          />
          <Route
            path="qna"
            element={<BoardTab key="qna" boardType="qna" title="선생님 Q&A" />}
          />
          <Route
            path="dataroom"
            element={
              <BoardTab
                key="dataroom"
                boardType="dataroom"
                title="학습자료실"
              />
            }
          />
          <Route path=":boardType/:postSn" element={<BoardPostDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
      <Route path="/header/books" element={<BookMain />} />
      <Route path="/header/Ainavigator" element={<AiNavigator />} />
      <Route path="/lecturelist" element={<LectureListPage />} />
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/courses/:courseSn" element={<CourseInfoPage />} />
      <Route path="/test/viewer" element={<ViewerTestPage />} />

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
        <Route path="/parentroom" element={<ParentPage />} />

        {/* 마이페이지 라우트 */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mycalendar" element={<MyCalendarPage />} />
        <Route path="/mylecture" element={<MyLecturePage />} />
        <Route path="/mypage/verify" element={<VerifyPasswordPage />} />
        <Route path="/mypage/profile/edit" element={<ProfileEditPage />} />
        <Route path="/my-classrooms" element={<MyClassroomsPage />} />
        <Route path="/classroom/:classId" element={<ClassroomLayout />}>
          <Route index element={<ClassroomPage />} />
        </Route>
        <Route path="/customer/qna/write" element={<QnaWritePage />} />
        <Route path="/customer/qna/my" element={<QnAPage myOnly />} />
        <Route path="/customer/qna/:postSn/edit" element={<QnaEditPage />} />
        <Route path="/enroll" element={<LectureEnrollPage />} />
        <Route path="/mylecture/book" element={<BookOrderPage />} />
        <Route path="/mylecture/history" element={<LectureHistoryPage />} />
        <Route path="/mycart" element={<CartPage />} />
        <Route path="/mycart/orderhistory" element={<OrderHistoryPage />} />
        <Route path="/mypage/couponpoint" element={<CouponPointPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>

      {/* 관리자 전용 라우트 */}
      <Route element={<ProtectedRouteAdmin />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
