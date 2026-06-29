import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ClassroomPage from "./pages/Classroom/ClassroomPage";
import MyClassroomsPage from "./pages/Classroom/MyClassroomsPage";
import ClassroomLayout from "./layouts/ClassroomLayout";
import ClassroomExamPage from "./pages/Classroom/ClassroomExamPage";
import ClassroomAssignPage from "./pages/Classroom/ClassroomAssignPage";
import ClassroomNoticePage from "./pages/Classroom/ClassroomNoticePage";
import ClassroomQnaPage from "./pages/Classroom/ClassroomQnaPage";
import ClassroomDataroomPage from "./pages/Classroom/ClassroomDataroomPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import MyPage from "./pages/User/Mypage/MyPage";
import NotificationsPage from "./pages/User/Mypage/NotificationsPage";
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
import GuidePrepare from "./pages/ServiceCenter/Guide/GuidePrepare";
import GuideInfo from "./pages/ServiceCenter/Guide/GuideInfo";
import GuideStart from "./pages/ServiceCenter/Guide/GuideStart";
import GuideUse from "./pages/ServiceCenter/Guide/GuideUse";
import DataRoomDetailPage from "./pages/ServiceCenter/DataRoom/DataRoomDetailPage";
import VerifyPasswordPage from "./pages/User/VerifyPasswordPage";
import NotFound from "./pages/NotFound";
import MyLecturePage from "./pages/User/Mypage/MyLecturePage";
import ProfileEditPage from "./pages/User/Mypage/ProfileEditPage";
import StudyReportPage from "./pages/User/Mypage/StudyReportPage";
import GradesPage from "./pages/User/Mypage/GradesPage";
import MyCalendarPage from "./pages/User/Mypage/MyCalendarPage";
import CartPage from "./pages/User/Mypage/CartPage";
import CheckoutPage from "./pages/User/Mypage/CheckoutPage";
import CheckoutSuccessPage from "./pages/User/Mypage/CheckoutSuccessPage";
import CheckoutFailPage from "./pages/User/Mypage/CheckoutFailPage";
import Instructors from "./pages/Instructor/InstructorsPage";
import InstructorDetailPage from "./pages/Instructor/InstructorDetailPage";
import InstructorBoardLayout from "./pages/Instructor/InstructorBoardLayout";
import CoursesTab from "./pages/Instructor/InstructorBoard/CoursesTab";
import BoardTab from "./pages/Instructor/InstructorBoard/BoardTab";
import BoardPostDetailPage from "./pages/Instructor/InstructorBoard/BoardPostDetailPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import OrderHistoryPage from "./pages/User/Mypage/OrderHistoryPage";
import CouponPointPage from "./pages/User/Mypage/CouponPointPage";
import BookMain from "./pages/Books/BooksPage";
import BookDetailPage from "./pages/Books/BookDetailPage";
import ParentPage from "./ParentPage/ParentPage.tsx";
import AiNavigator from "./pages/AiNavigator/AiNavigatorPage";
import LectureListPage from "./pages/Lecture/LectureListPage.tsx";
import ParentJoinPage from "./pages/User/ParentJoinPage.tsx";
import CourseListPage from "./pages/course/CourseListPage.tsx";
import CourseInfoPage from "./pages/course/CourseInfoPage.tsx";
import HermesVideoViewer from "./components/viewer/HermesVideoViewer.tsx";
import OrderHistoryDetailPage from "./pages/User/Mypage/OrderHistoryDetailPage.tsx";
import MyQnaPage from "./pages/User/Mypage/MyQnaPage.tsx";
import AddressBookPage from "./pages/User/Mypage/AddressBookPage.tsx";
import CouponSelectPopupPage from "./pages/User/Mypage/CouponSelectPopupPage.tsx";
import RefundPolicyPage from "./pages/Info/RefundPolicyPage.tsx";
import TaxDeductionPage from "./pages/Info/TaxDeductionPage.tsx";
import ShippingDetailPage from "./pages/User/Mypage/ShippingDetailPage.tsx";
import SuneungGradeCutPage from "./pages/Suneung/SuneungGradeCutPage.tsx";

/* cSpell:disable */
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

      <Route path="/gradeCut" element={<SuneungGradeCutPage />} />

      {/* 공용 라우트 */}
      <Route path="/test/toss-pay/fail" element={<TossPayFailTestPage />} />
      {/* 토스 결제 완료/실패 리다이렉트 (결제창에서 successUrl/failUrl로 이동) */}
      <Route path="/success" element={<CheckoutSuccessPage />} />
      <Route path="/fail" element={<CheckoutFailPage />} />
      <Route path="/instructors" element={<Instructors />} />
      <Route path="/instructor/:instrUuid">
        <Route index element={<InstructorDetailPage />} />
        <Route element={<InstructorBoardLayout />}>
          <Route path="courses" element={<CoursesTab />} />
          {/* <Route path="courses/:courseSn" element={<CourseDetailPage />} /> */}
          <Route path="courses/:courseSn" element={<CourseInfoPage />} />
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
      <Route path="/header/books/:textbookSn" element={<BookDetailPage />} />
      <Route path="/header/Ainavigator" element={<AiNavigator />} />
      <Route path="/lecturelist" element={<LectureListPage />} />
      <Route path="/courses" element={<CourseListPage />} />

      {/* 고객센터 라우트 */}
      <Route path="/customer/faq" element={<FAQPage />} />
      <Route path="/customer/faq/:postSn" element={<FaqDetailPage />} />
      <Route path="/customer/guide/prepare" element={<GuidePrepare />} />
      <Route path="/customer/guide/info" element={<GuideInfo />} />
      <Route path="/customer/guide/start" element={<GuideStart />} />
      <Route path="/customer/guide/use" element={<GuideUse />} />
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

      {/* 인증이 필요한 라우트 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/parentroom" element={<ParentPage />} />

        <Route path="/viewer" element={<HermesVideoViewer />} />

        {/* 마이페이지 라우트 */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mycalendar" element={<MyCalendarPage />} />
        <Route path="/mylecture" element={<MyLecturePage />} />
        <Route path="/mypage/report" element={<StudyReportPage />} />
        <Route path="/mypage/grades" element={<GradesPage />} />
        <Route path="/mypage/couponpoint" element={<CouponPointPage />} />
        <Route path="/mypage/notifications" element={<NotificationsPage />} />
        <Route path="/mypage/verify" element={<VerifyPasswordPage />} />
        <Route path="/mypage/profile/edit" element={<ProfileEditPage />} />
        <Route path="/my-classrooms" element={<MyClassroomsPage />} />
        <Route path="/classroom/:classId" element={<ClassroomLayout />}>
          <Route index element={<ClassroomPage />} />
        </Route>
        <Route path="/classroom/:classId/exams/:examSn" element={<ClassroomExamPage />} />
        <Route path="/classroom/:classId/assignments/:asgmtSn" element={<ClassroomAssignPage />} />
        <Route path="/classroom/:classId/notices/:postSn" element={<ClassroomNoticePage />} />
        <Route path="/classroom/:classId/qna/:postSn" element={<ClassroomQnaPage />} />
        <Route path="/classroom/:classId/dataroom/:postSn" element={<ClassroomDataroomPage />} />
        <Route path="/customer/qna/write" element={<QnaWritePage />} />
        <Route path="/customer/qna/my" element={<QnAPage myOnly />} />
        <Route path="/customer/qna/:postSn/edit" element={<QnaEditPage />} />
        {/* <Route path="/enroll" element={<LectureEnrollPage />} /> */}
        {/* <Route path="/mylecture/book" element={<BookOrderPage />} /> */}
        {/* <Route path="/mylecture/history" element={<LectureHistoryPage />} /> */}
        <Route path="/mycart" element={<CartPage />} />
        <Route path="/mypage/qna" element={<MyQnaPage />} />
        <Route path="/mypage/address-book" element={<AddressBookPage />} />
        <Route path="/mypage/coupon-select" element={<CouponSelectPopupPage />} />
        <Route path="/info/refund" element={<RefundPolicyPage />} />
        <Route path="/info/tax-deduction" element={<TaxDeductionPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/mycart/orderhistory" element={<OrderHistoryPage />} />
        <Route path="/mycart/orderhistory" element={<OrderHistoryPage />} />
        <Route
          path="/mycart/orderhistory/:ordSn"
          element={<OrderHistoryDetailPage />}
        />
        <Route
          path="/mycart/orderhistory/:ordSn/shipping"
          element={<ShippingDetailPage />}
        />

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
