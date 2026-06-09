import { useState, useEffect } from "react";
import {
  RefreshCw,
  ExternalLink,
  Navigation as NavIcon,
  HelpCircle,
} from "lucide-react";
import api from "../../api/api";

interface SubjectClassification {
  subjClId: number;
  subjClNm: string;
}

interface Instructor {
  userId: string;
  userName: string;
}

interface TextbookDto {
  textbookSn: number;
  textbookNm: string;
  pubrNm: string;
  authrNm: string;
  isbnNo: string;
  trgtGrdCn: string;
  subjClId: number;
  subjClNm: string;
  salePrcAmt: number;
  dlvrAmt: number;
  thmbImg: string | null;
  useYn: string;
  regDt: string;
}

const PAGE_SIZE = 8;

const FilterPill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-xs px-3.5 py-1.5 rounded-md border transition-all cursor-pointer whitespace-nowrap
      ${
        active
          ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm shadow-blue-100"
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
      }`}
  >
    {label}
  </button>
);

export default function TextbookPage() {
  const [categories, setCategories] = useState<SubjectClassification[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [textbooks, setTextbooks] = useState<TextbookDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedSubjClId, setSelectedSubjClId] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const dDay = "166";

  // 과목 분류 목록 조회
  useEffect(() => {
    api
      .get("/api/course/subject-classification")
      .then((res) => setCategories(res.data))
      .catch((e) => console.error("과목 분류 조회 실패", e));
  }, []);

  // 과목 선택 시 강사 목록 조회
  useEffect(() => {
    if (!selectedSubjClId) return;

    api
      .get("/api/course/instructors", {
        params: { subjClId: selectedSubjClId },
      })
      .then((res) => setInstructors(res.data))
      .catch((e) => console.error("강사 목록 조회 실패", e));
  }, [selectedSubjClId]);

  // 교재 목록 조회
  useEffect(() => {
    const fetchTextbooks = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          page,
          size: PAGE_SIZE,
        };
        if (selectedSubjClId) params.subjClId = selectedSubjClId;
        if (selectedTeacher) params.instrUserNm = selectedTeacher;
        const res = await api.get("/api/textbook", { params });
        setTextbooks(res.data.items);
        setTotalCount(res.data.totalCount);
      } catch (e) {
        console.error("교재 목록 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTextbooks();
  }, [selectedSubjClId, page]);

  const handleCategoryChange = (subjClId: number | null) => {
    setSelectedSubjClId(subjClId);
    setSelectedTeacher("");
    if (!subjClId) setInstructors([]); // useEffect 밖에서 처리
    setPage(1);
  };

  const handleReset = () => {
    setSelectedSubjClId(null);
    setSelectedTeacher("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-5">
        {/* 상단 타이틀 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md">
              2027 대입 패키지
            </span>
            <span className="text-xs text-gray-400 font-medium">
              수능 D-{dDay}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            HERMES 강의 교재
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            과목별, 강사별 최신 입고 완료 교재들을 한눈에 확인하고 구매하실 수
            있습니다.
          </p>
        </div>

        {/* 필터 테이블 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse text-left">
            <tbody>
              <tr className="border-b border-gray-100">
                <th className="w-24 sm:w-28 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 uppercase tracking-wider text-center select-none">
                  과목
                </th>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 flex-wrap">
                    <FilterPill
                      label="전체"
                      active={selectedSubjClId === null}
                      onClick={() => handleCategoryChange(null)}
                    />
                    {categories.map((c) => (
                      <FilterPill
                        key={c.subjClId}
                        label={c.subjClNm}
                        active={selectedSubjClId === c.subjClId}
                        onClick={() => handleCategoryChange(c.subjClId)}
                      />
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-24 sm:w-28 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 uppercase tracking-wider text-center select-none">
                  선생님
                </th>
                <td className="px-4 py-3.5">
                  {!selectedSubjClId ? (
                    <span className="text-xs text-gray-400">
                      과목을 먼저 선택해주세요.
                    </span>
                  ) : (
                    <div className="flex gap-1.5 flex-wrap">
                      <FilterPill
                        label="전체"
                        active={selectedTeacher === ""}
                        onClick={() => setSelectedTeacher("")}
                      />
                      {instructors.map((i) => (
                        <FilterPill
                          key={i.userId}
                          label={i.userName}
                          active={selectedTeacher === i.userName}
                          onClick={() => setSelectedTeacher(i.userName)}
                        />
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 교재 목록 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-gray-600">
              총 <b className="text-gray-900 font-semibold">{totalCount}</b>권의
              전용 교재
            </span>
            <button onClick={handleReset} className="cursor-pointer">
              <RefreshCw
                size={15}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              />
            </button>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm">
              <p className="text-sm text-gray-400">교재를 불러오는 중...</p>
            </div>
          ) : textbooks.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-200 mx-auto mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <p className="text-sm text-gray-400 font-medium">
                해당하는 교재가 없습니다.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {textbooks.map((book) => (
                <div
                  key={book.textbookSn}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all border border-gray-100 hover:shadow-md hover:border-gray-200"
                >
                  <div className="flex flex-col md:flex-row gap-8 p-8 items-start md:items-stretch">
                    {/* 북 커버 */}
                    <div className="flex-shrink-0 flex justify-center md:justify-start">
                      {book.thmbImg ? (
                        <img
                          src={book.thmbImg}
                          alt={book.textbookNm}
                          className="w-36 h-48 object-cover rounded-r-xl shadow-md"
                        />
                      ) : (
                        <div className="w-36 h-48 bg-blue-900 rounded-r-xl shadow-md p-3 flex flex-col justify-between text-white border-l-4 border-black/20">
                          <div className="space-y-1">
                            <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold tracking-widest uppercase">
                              HERMES
                            </span>
                            <h5 className="text-[11px] font-bold leading-tight tracking-tight line-clamp-3 mt-1">
                              {book.textbookNm}
                            </h5>
                          </div>
                          <span className="text-[10px] font-medium tracking-tight text-right block opacity-80">
                            {book.authrNm} 저
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 본문 */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-blue-600">
                            {book.subjClNm}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            입고완료
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug">
                          {book.textbookNm}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                          {book.authrNm} 선생님
                        </p>
                        {book.trgtGrdCn && (
                          <ul className="space-y-1 pt-1">
                            {book.trgtGrdCn.split("\n").map((line, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-1.5 text-xs text-gray-500 leading-relaxed"
                              >
                                <span className="text-blue-400 flex-shrink-0 mt-0.5">
                                  ·
                                </span>
                                {line}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="text-xs pt-3 border-t border-gray-100">
                        <span className="font-semibold text-gray-700 block mb-1">
                          [출판사]
                        </span>
                        <span className="text-gray-500">
                          {book.pubrNm ?? "-"}
                        </span>
                      </div>
                    </div>

                    {/* 결제 패널 */}
                    <div className="w-full md:w-52 flex flex-col justify-between items-end shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right w-full mb-4">
                        <span className="text-xs text-gray-400 font-medium block mb-0.5">
                          도서 판매가
                        </span>
                        <strong className="text-2xl font-black text-gray-900 tracking-tight">
                          {book.salePrcAmt.toLocaleString()}원
                        </strong>
                        {book.dlvrAmt > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            배송비 {book.dlvrAmt.toLocaleString()}원
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 w-full">
                        <button className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                          장바구니
                        </button>
                        <button className="flex-1 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer whitespace-nowrap shadow-sm">
                          구매하기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer text-sm"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center border rounded text-xs font-medium transition-colors cursor-pointer
                    ${page === p ? "bg-gray-900 text-white border-gray-900" : "text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer text-sm"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 text-xs border-t border-gray-800 mt-16">
        <div className="border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
            <div className="flex gap-6 font-medium">
              <button className="hover:text-white transition-colors cursor-pointer">
                회사소개
              </button>
              <button className="text-blue-400 font-semibold hover:underline cursor-pointer">
                개인정보처리방침
              </button>
              <button className="hover:text-white transition-colors cursor-pointer">
                이용약관
              </button>
            </div>
            <div className="flex gap-3">
              <button className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 cursor-pointer">
                <ExternalLink size={13} />
              </button>
              <button className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 cursor-pointer">
                <NavIcon size={13} />
              </button>
              <button className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 cursor-pointer">
                <HelpCircle size={13} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-gray-500">&copy; HERMES All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
