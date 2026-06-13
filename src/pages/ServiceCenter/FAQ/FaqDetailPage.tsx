import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ServiceSidebar from "../components/ServiceSidebar";
import type { FaqItem } from '../../../types/CustomerServiceInterface';
import FAQHeader from "./components/FAQHeader";
import api from "../../../api/api";

export default function FaqDetailPage() {
  const { postSn } = useParams<{ postSn: string }>();
  const navigate = useNavigate();

  const [faq, setFaq] = useState<FaqItem | null>(null);
  const [prev, setPrev] = useState<FaqItem | null>(null);
  const [next, setNext] = useState<FaqItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [postSn]);

  useEffect(() => {
    if (!postSn) return;
    const fetchFaq = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/faq/${postSn}`);
        const data: FaqItem = res.data;
        setFaq(data);

        // 이전글/다음글 조회
        const [prevRes, nextRes] = await Promise.allSettled([
          api.get(`/api/faq/${postSn}/prev`, { params: { faqCtgCd: data.faqCtgCd } }),
          api.get(`/api/faq/${postSn}/next`, { params: { faqCtgCd: data.faqCtgCd } }),
        ]);

        setPrev(prevRes.status === "fulfilled" ? prevRes.value.data : null);
        setNext(nextRes.status === "fulfilled" ? nextRes.value.data : null);
      } catch (err) {
        console.error("FAQ 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, [postSn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">FAQ를 찾을 수 없습니다.</p>
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
            <FAQHeader subTitle="궁금한 내용을 빠르게 해결하세요!" />

            {/* 서브 브레드크럼 */}
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-3 mb-1">
              <span>{faq.faqCtgNm} 관련</span>
              <span>&gt;</span>
              <span>{faq.faqSubCtgNm}</span>
            </div>

            {/* 제목 */}
            <h2 className="text-xl font-extrabold text-gray-900 leading-snug mb-4">{faq.postSj}</h2>

            {/* 본문 내용 */}
            <div className="min-h-48 py-6 border-b border-gray-200 mb-6">
              {faq.postCn ? (
                <div className="text-sm text-gray-700 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: faq.postCn }} />
              ) : (
                <p className="text-sm text-gray-400">내용이 없습니다.</p>
              )}
            </div>

            {/* 전체목록 버튼 */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/customer/faq")}
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
                onClick={() => prev && navigate(`/customer/faq/${prev.postSn}`)}
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
                onClick={() => next && navigate(`/customer/faq/${next.postSn}`)}
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

