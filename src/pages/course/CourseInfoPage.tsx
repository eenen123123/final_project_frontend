import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/*
bookSmry: "태스트 요약\r\n태스트 요약 2"
courseNm: null
courseSn: 81


dlvrAmt: 3000


instrUserNm: null


isbnNo: "1234567891011"


keyword: null


lastMdfrId: "testuser20"


mdfcnDt: "2026-06-10T12:00:14.55"


pubrNm: "지학사"


purchPrcAmt: 10000


regDt: "2026-06-10T12:00:14.55"


rgtrId: "testuser20"


salePrcAmt: 38900


showArchived: false


sort: null


subjClId: null


subjClNm: null


subjId: 6


subjNm: null


tagline: "태그라인 테스트(부제목)"


textbookNm: "5일간의 수학"


textbookSn: 21


thmbImg: "http://res.cloudinary.com/dczqmsune/image/upload/v1781060415/mhndcapfncllre8synnf.png"


tocCn: "PART1. \r\nPART2.\r\nPART3."


trgtGrdCn: "[교재 구성]\r\n알참\r\n\r\n[교재 특징]\r\n라면받침 용도 특화"


useYn: "Y"
*/

interface Textbook {
  textbookSn: number;
  courseSn: number;
  textbookNm: string;
  isbnNo: string;
  pubrNm: string;
  purchPrcAmt: number;
  salePrcAmt: number;
  dlvrAmt: number;
  trgtGrdCn: string;
  tocCn: string;
  bookSmry: string;
  thmbImg: string;
}

interface Course {
  courseSn: number;
  courseName: string;
  subjectId: number;
  subjectName: string;
  instructorName: string;
  coursePrice?: number;
  explain: string;
  isBest: boolean;
  isNew: boolean;
  instructorProfileImg: string;
}

interface Lecture {
  lectureSn: number;
  courseSn: number;
  lectureName: string;
  lectureVideoFileId: number;
  lectureDuration: number;
  lectureExplanation: string;
}

interface CourseDetailResponse {
  course: Course;
  lectures: Lecture[];
}

type TabType = "info" | "textbook" | "lectures" | "reviews";

const TABS: { key: TabType; label: string }[] = [
  { key: "info", label: "강좌정보" },
  { key: "textbook", label: "교재정보" },
  { key: "lectures", label: "강의목록" },
  { key: "reviews", label: "수강후기" },
];

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const TEXTBOOK_PRICE = 28000;
const SHIPPING_FEE = 2800;

export default function CourseInfoPage() {
  const { courseSn } = useParams<{ courseSn: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [textBooks, setTextBooks] = useState<Textbook[]>([]);
  const [includeTextbook, setIncludeTextbook] = useState(true);

  useEffect(() => {
    if (!courseSn) return;
    setLoading(true);
    axios
      .get<CourseDetailResponse>(`/api/course/${courseSn}`)
      .then((res) => {
        setCourse(res.data.course);
        setLectures(res.data.lectures);
      })
      .finally(() => setLoading(false));
  }, [courseSn]);

  useEffect(() => {
    const getTextBooks = async () => {
      if (!course) return;
      try {
        const res = await axios.get<Textbook[]>(
          `/api/textbook/course/${course.courseSn}`,
        );
        setTextBooks(res.data);
        console.log("교재 정보:", res.data);
      } catch (error) {
        console.error("교재 정보 불러오기 실패:", error);
      }
    };
    getTextBooks();
  }, [course]);

  if (loading)
    return (
      <p className="py-16 text-center text-sm text-gray-400">불러오는 중...</p>
    );
  if (!course)
    return (
      <p className="py-16 text-center text-sm text-gray-400">
        강좌를 찾을 수 없습니다.
      </p>
    );

  const coursePrice = course.coursePrice ?? 0;
  const total =
    coursePrice + (includeTextbook ? TEXTBOOK_PRICE + SHIPPING_FEE : 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 강좌 헤더 */}
      <div className="border border-gray-200 rounded mb-2">
        <div className="flex gap-5 p-5">
          {/* 강사 프로필 이미지 */}
          <div className="flex-shrink-0 w-36 h-40 bg-gray-100 rounded overflow-hidden">
            {course.instructorProfileImg ? (
              <img
                src={course.instructorProfileImg}
                alt={course.instructorName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                사진없음
              </div>
            )}
          </div>

          {/* 강좌 정보 */}
          <div className="flex-1 min-w-0">
            {/* 뱃지 */}
            <div className="flex flex-wrap gap-1 mb-2">
              {textBooks.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 border border-teal-300">
                  교재별도판매
                </span>
              )}
              {course.isNew && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-800 text-white">
                  NEW
                </span>
              )}
              {course.isBest && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                  BEST
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                인기
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 border border-purple-300">
                추천
              </span>
            </div>

            <h1 className="text-base font-bold text-gray-900 mb-3">
              {course.courseName}
            </h1>

            {/* 메타 정보 그리드 */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-xs text-gray-700 mb-3 border-b border-gray-100 pb-3">
              <div>
                <span className="text-gray-400 mr-2">수강대상</span>고3, N수
              </div>
              <div>
                <span className="text-gray-400 mr-2">강좌유형</span>수능
              </div>
              <div>
                <span className="text-gray-400 mr-2">학습단계</span>문제풀이
              </div>
              <div>
                <span className="text-gray-400 mr-2">수강기간</span>48일
              </div>
              <div>
                <span className="text-gray-400 mr-2">강좌구성</span>
                {lectures.length}강
              </div>
              <div>
                <span className="text-gray-400 mr-2">제작방식</span>
                {course.subjectName}
              </div>
            </div>

            {/* 강사 + OT 버튼 */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-800">
                {course.subjectName} {course.instructorName} 선생님{" "}
                <span className="text-gray-400">🏠</span>
              </span>
              <button className="text-xs border border-gray-400 text-gray-600 rounded px-4 py-1 hover:bg-gray-100 cursor-pointer transition-colors">
                OT
              </button>
            </div>
          </div>
        </div>

        {/* 구매혜택 */}
        <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          구매혜택
        </div>
      </div>

      {/* 구매 섹션 */}
      <div className="border border-gray-200 rounded mb-6">
        {/* 강좌 행 */}
        <div className="flex items-center px-5 py-4 border-b border-gray-100 gap-3">
          <input
            type="checkbox"
            checked
            readOnly
            className="w-4 h-4 accent-blue-600 flex-shrink-0"
          />
          <span className="text-xs text-gray-400 w-12 flex-shrink-0">강좌</span>
          <span className="flex-1 text-sm text-gray-900">
            {course.courseName}
          </span>
          <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
            {coursePrice.toLocaleString()}원
          </span>
        </div>

        {/* 주교재 행 */}
        {/* <div className="flex items-center px-5 py-4 border-b border-gray-100 gap-3">
          <input
            type="checkbox"
            checked={includeTextbook}
            onChange={(e) => setIncludeTextbook(e.target.checked)}
            className="w-4 h-4 accent-blue-600 flex-shrink-0 cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-12 flex-shrink-0">
            주교재
          </span>
          <span className="flex-1 text-sm text-gray-900">
            {course.courseName}
          </span>
          <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
            {TEXTBOOK_PRICE.toLocaleString()}원
          </span>

          
        </div> */}
        {textBooks.length > 0 &&
          textBooks.map((tb) => (
            <div
              key={tb.textbookSn}
              className="flex items-center px-5 py-4 border-b border-gray-100 gap-3"
            >
              <input
                type="checkbox"
                checked={includeTextbook}
                onChange={(e) => setIncludeTextbook(e.target.checked)}
                className="w-4 h-4 accent-blue-600 flex-shrink-0 cursor-pointer"
              />
              <span className="text-xs text-gray-400 w-12 flex-shrink-0">
                주교재
              </span>
              <span className="flex-1 text-sm text-gray-900">
                {tb.textbookNm}
              </span>
              <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                {tb.salePrcAmt.toLocaleString()}원
              </span>
            </div>
          ))}

        {/* 총 결제금액 */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-gray-900">총 결제금액</span>
            <span className="text-lg font-bold text-orange-500">
              {total.toLocaleString()}원
            </span>
          </div>
          <p className="text-xs text-gray-400">
            강좌 {coursePrice.toLocaleString()}원
            {includeTextbook &&
              ` + 주교재 ${TEXTBOOK_PRICE.toLocaleString()}원 + 배송비 ${SHIPPING_FEE.toLocaleString()}원`}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-50">
          <button className="text-sm border border-gray-300 text-gray-600 rounded px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors">
            쿠폰조회
          </button>
          <div className="flex gap-2">
            <button className="text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded px-5 py-2 cursor-pointer transition-colors">
              패스 수강
            </button>
            <button className="text-sm font-semibold text-white bg-gray-800 hover:bg-gray-900 rounded px-5 py-2 cursor-pointer transition-colors">
              장바구니
            </button>
            <button className="text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded px-5 py-2 cursor-pointer transition-colors">
              구매하기
            </button>
          </div>
        </div>
      </div>

      {/* 수강후기 / 회원 PICK */}
      <div className="grid grid-cols-2 gap-0 mb-8 border border-gray-200 rounded">
        <div className="p-4 border-r border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            BEST 수강후기
          </h3>
          <p className="text-xs text-gray-400">
            작성된 BEST 수강후기가 없습니다.
          </p>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">
              이 강좌를 수강한 회원 PICK
            </h3>
            <span className="text-gray-400 text-sm cursor-pointer">+</span>
          </div>
          <p className="text-xs text-gray-400">관련 강좌가 없습니다.</p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 mb-6 flex">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-8 py-3 text-sm font-medium cursor-pointer transition-colors ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600 -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "info" && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">강좌정보</h2>
          <div className="divide-y divide-gray-100 border-t border-gray-300">
            <div className="py-5">
              <p className="text-sm font-semibold text-gray-700 mb-2 pl-4">
                강좌범위
              </p>
              <p className="text-sm text-gray-600 pl-4">
                {course.subjectName} 전 범위
              </p>
            </div>
            <div className="py-5">
              <p className="text-sm font-semibold text-gray-700 mb-2 pl-4">
                강좌특징
              </p>
              <p className="text-sm text-gray-600 leading-relaxed pl-4 whitespace-pre-line">
                {course.explain || "강좌 설명이 없습니다."}
              </p>
            </div>
            <div className="py-5">
              <p className="text-sm font-semibold text-gray-700 mb-2 pl-4">
                수강대상
              </p>
              <p className="text-sm text-gray-600 pl-4">고3, N수</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "textbook" &&
        (textBooks.length > 0 ? (
          textBooks.map((tb) => (
            <div
              key={tb.textbookSn}
              className="flex items-start gap-4 py-5 px-3 border-b border-gray-100"
            >
              <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {tb.thmbImg ? (
                  <img
                    src={tb.thmbImg}
                    alt={tb.textbookNm}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    이미지없음
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 mb-0.5">
                  {tb.textbookNm}
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  {tb.pubrNm} · {tb.isbnNo}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="text-gray-400">판매가</span>
                  <span className="font-semibold text-gray-900">
                    {tb.salePrcAmt.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4">교재정보</h2>
            <p className="text-sm text-gray-400">교재 정보가 없습니다.</p>
          </div>
        ))}

      {activeTab === "lectures" && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">강의목록</h2>
          {lectures.length > 0 ? (
            <ul className="divide-y divide-gray-100 border-t border-gray-200">
              {lectures.map((lecture, idx) => (
                <li
                  key={lecture.lectureSn}
                  className="flex items-center gap-4 py-3 text-sm text-gray-700 hover:bg-gray-50 px-2"
                >
                  <span className="text-gray-400 w-6 text-right flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1">{lecture.lectureName}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatDuration(lecture.lectureDuration)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">강의 목록이 없습니다.</p>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">수강후기</h2>
          <p className="text-sm text-gray-400">작성된 수강후기가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
