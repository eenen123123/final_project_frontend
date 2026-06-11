import { useState, useEffect } from "react";
import {
  RefreshCw,
  ExternalLink,
  Navigation as NavIcon,
  HelpCircle,
} from "lucide-react";
import api from "../../api/api";
import BookFilter from "./components/BookFilter";
import BookCard, { type TextbookDto } from "./components/BookCard";

const PAGE_SIZE = 8;

export default function BooksPage() {
  const [textbooks, setTextbooks] = useState<TextbookDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedSubjClId, setSelectedSubjClId] = useState<number | null>(null);
  const [selectedSubjId, setSelectedSubjId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    const fetchTextbooks = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          page,
          size: PAGE_SIZE,
        };
        if (selectedSubjClId) params.subjClId = selectedSubjClId;
        if (selectedSubjId) params.subjId = selectedSubjId;

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
  }, [selectedSubjClId, selectedSubjId, page]);

  const handleSubjClChange = (id: number | null) => {
    setSelectedSubjClId(id);
    setSelectedSubjId(null);
    setPage(1);
  };

  const handleSubjChange = (id: number | null) => {
    setSelectedSubjId(id);
    setPage(1);
  };

  const handleReset = () => {
    setSelectedSubjClId(null);
    setSelectedSubjId(null);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-5">
        {/* 상단 타이틀 */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            HERMES 강의 교재
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            과목별 최신 입고 완료 교재들을 한눈에 확인하고 구매하실 수 있습니다.
          </p>
        </div>

        {/* 필터 */}
        <BookFilter
          selectedSubjClId={selectedSubjClId}
          selectedSubjId={selectedSubjId}
          onSubjClChange={handleSubjClChange}
          onSubjChange={handleSubjChange}
        />

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
                <BookCard key={book.textbookSn} book={book} />
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
