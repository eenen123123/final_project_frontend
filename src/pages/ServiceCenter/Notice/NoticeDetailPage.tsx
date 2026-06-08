import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ServiceSidebar from "../components/ServiceSidebar";
import NoticeHeader from "./components/NoticeHeader";
import api from "../../../api/api";
import type { NoticeItem } from '../../../types/CustomerServiceInterface';

const TYPE_BADGE: Record<string, string> = {
  "01": "bg-blue-50 text-blue-600",
  "02": "bg-orange-50 text-orange-600",
  "03": "bg-red-50 text-red-600",
};

export default function NoticeDetailPage() {
  const { postSn } = useParams<{ postSn: string }>();
  const navigate = useNavigate();

  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [prev, setPrev] = useState<NoticeItem | null>(null);
  const [next, setNext] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postSn) return;
    const fetchNotice = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/notice/${postSn}`);
        setNotice(res.data);

        // 이전글/다음글 조회
        const [prevRes, nextRes] = await Promise.allSettled([
          api.get(`/api/notice/${postSn}/prev`),
          api.get(`/api/notice/${postSn}/next`),
        ]);

        setPrev(prevRes.status === "fulfilled" ? prevRes.value.data : null);
        setNext(nextRes.status === "fulfilled" ? nextRes.value.data : null);
      } catch (err) {
        console.error("공지사항 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [postSn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">공지사항을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* 사이드바: 모바일에서 숨김 */}
          <div className="hidden md:block">
            <ServiceSidebar />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <NoticeHeader />

            {/* 유형 뱃지 + 제목 */}
            <div className="flex items-center gap-2 mt-3 mb-1">
              {notice.noticeTypeCd && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${TYPE_BADGE[notice.noticeTypeCd] ?? "bg-gray-50 text-gray-500"}`}
                >
                  {notice.noticeTypeNm}
                </span>
              )}
              <h2 className="text-xl font-extrabold text-gray-900 leading-snug">{notice.postSj}</h2>
            </div>

            {/* 등록일 */}
            <p className="text-xs text-gray-400 mb-4">등록일 : {notice.regDt?.slice(0, 10).replace(/-/g, ".")}</p>

            {/* 본문 */}
            <div className="min-h-48 py-6 border-t border-b border-gray-200 mb-6">
              {notice.postCn ? (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{notice.postCn}</div>
              ) : (
                <p className="text-sm text-gray-400">내용이 없습니다.</p>
              )}
            </div>

            {/* 전체목록 버튼 */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/customer/notice")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                전체목록
              </button>
            </div>

            {/* 이전글 / 다음글 */}
            <div className="border-t border-gray-200">
              <div
                onClick={() => prev && navigate(`/customer/notice/${prev.postSn}`)}
                className={`flex items-center gap-3 px-3 py-3 border-b border-gray-100 transition-colors ${prev ? "hover:bg-gray-50 cursor-pointer" : "opacity-40"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                <span className="text-xs text-gray-400 w-12 flex-shrink-0">이전글</span>
                <span className="text-sm text-gray-500 truncate">{prev ? prev.postSj : "이전 글이 없습니다."}</span>
              </div>
              <div
                onClick={() => next && navigate(`/customer/notice/${next.postSn}`)}
                className={`flex items-center gap-3 px-3 py-3 transition-colors ${next ? "hover:bg-gray-50 cursor-pointer" : "opacity-40"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                <span className="text-xs text-gray-400 w-12 flex-shrink-0">다음글</span>
                <span className="text-sm text-gray-500 truncate">{next ? next.postSj : "다음 글이 없습니다."}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

