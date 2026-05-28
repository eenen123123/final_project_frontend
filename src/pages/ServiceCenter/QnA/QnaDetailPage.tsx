import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ServiceSidebar from "../components/ServiceSidebar";
import QnaHeader from "./components/QnaHeader";
import { useAuth } from "../../../auth/AuthContext";
import api from "../../../api/api";
import type { QnaItem } from "../../../types/board/QnaInterface";

export default function QnaDetailPage() {
  const { postSn } = useParams<{ postSn: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, getUserId, getRole } = useAuth();

  const [qna, setQna] = useState<QnaItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!postSn) return;
    const fetchQna = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/qna/${postSn}`);
        const data: QnaItem = res.data;

        // 비밀글 접근 제한
        if (data.secrYn === "Y") {
          const userId = getUserId();
          const role = getRole();
          if (!isAuthenticated || (userId !== data.wrtrUserId && !getRole()?.includes("ADMIN"))) {
            setDenied(true);
            setLoading(false);
            return;
          }
        }

        setQna(data);
      } catch (err) {
        console.error("QnA 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQna();
  }, [postSn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full max-w-5xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <div className="hidden md:block">
              <ServiceSidebar />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <QnaHeader />
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <p className="text-sm font-semibold text-gray-600">비밀글입니다.</p>
                <p className="text-xs text-gray-400">작성자 본인만 열람할 수 있습니다.</p>
                <button
                  onClick={() => navigate("/customer/qna")}
                  className="mt-2 px-5 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  목록으로
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!qna) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">게시글을 찾을 수 없습니다.</p>
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
            <QnaHeader />

            {/* 질문 영역 */}
            <div className="mt-4 border border-gray-200 rounded-sm">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                    {qna.qnaCtgNm}
                  </span>
                  {qna.secrYn === "Y" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  )}
                  {qna.answStatCd === "01" ? (
                    <span className="text-xs text-gray-400 font-semibold">답변대기</span>
                  ) : (
                    <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                      답변완료
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{qna.regDt?.slice(0, 10)}</span>
              </div>
              <div className="px-4 py-5">
                <h2 className="text-base font-bold text-gray-900 mb-3">{qna.postSj}</h2>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line min-h-24">{qna.postCn}</div>
              </div>
            </div>

            {/* 답변 영역 */}
            {qna.answStatCd === "02" && qna.answCn ? (
              <div className="mt-3 border border-blue-100 rounded-sm">
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">관리자 답변</span>
                    <span className="text-xs text-gray-400">{qna.answDt?.slice(0, 10)}</span>
                  </div>
                </div>
                <div className="px-4 py-5">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{qna.answCn}</div>
                </div>
              </div>
            ) : (
              <div className="mt-3 border border-gray-100 rounded-sm px-4 py-6 text-center bg-gray-50">
                <p className="text-xs text-gray-400">아직 답변이 등록되지 않았습니다.</p>
              </div>
            )}

            {/* 전체목록 버튼 */}
            <div className="mt-5">
              <button
                onClick={() => navigate("/customer/qna")}
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
          </div>
        </div>
      </div>
    </div>
  );
}
