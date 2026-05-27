import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ServiceSidebar from '../components/ServiceSidebar';
import type { FaqItem } from '../../../types/board/FaqInterface';

const API_BASE = 'http://localhost:8081';

export default function FaqDetailPage() {
  const { postSn } = useParams<{ postSn: string }>();
  const navigate = useNavigate();

  const [faq,     setFaq]     = useState<FaqItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postSn) return;
    const fetchFaq = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API_BASE}/api/faq/${postSn}`);
        const data = await res.json();
        setFaq(data);
      } catch (err) {
        console.error('FAQ 상세 조회 실패:', err);
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
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          <ServiceSidebar />

          <div className="flex-1 min-w-0">

            {/* 브레드크럼 */}
            <div className="text-xs text-gray-400 mb-3">
              <Link to="/customer" className="hover:text-blue-500 transition-colors">고객센터</Link>
              <span className="mx-1">&gt;</span>
              <Link to="/customer/faq" className="hover:text-blue-500 transition-colors">자주하는 질문(FAQ)</Link>
              {faq.faqCtgNm && (
                <>
                  <span className="mx-1">&gt;</span>
                  <span className="text-gray-600">{faq.faqCtgNm} 관련</span>
                </>
              )}
              {faq.faqSubCtgNm && (
                <>
                  <span className="mx-1">&gt;</span>
                  <span className="text-gray-600">{faq.faqSubCtgNm}</span>
                </>
              )}
            </div>

            {/* 타이틀 영역 */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-xl font-extrabold text-gray-900 leading-snug">
                {faq.postSj}
              </h1>
            </div>

            {/* 본문 내용 */}
            <div className="min-h-48 py-6 border-b border-gray-200 mb-6">
              {faq.postCn ? (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {faq.postCn}
                </div>
              ) : (
                <p className="text-sm text-gray-400">내용이 없습니다.</p>
              )}
            </div>

            {/* 전체목록 버튼 */}
            <div className="mb-6">
              <button
                onClick={() => navigate('/customer/faq')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                전체목록
              </button>
            </div>

            {/* 이전글 / 다음글 */}
            <div className="border-t border-gray-200">
              <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                <span className="text-xs text-gray-400 w-12 flex-shrink-0">이전글</span>
                <span className="text-sm text-gray-500">이전 글이 없습니다.</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                <span className="text-xs text-gray-400 w-12 flex-shrink-0">다음글</span>
                <span className="text-sm text-gray-500">다음 글이 없습니다.</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
