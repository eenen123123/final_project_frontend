import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceSidebar from '../components/ServiceSidebar';
import api from '../../../api/api';
import type { DataRoomItem } from '../../../types/board/DataRoomInterface';

export default function DataRoomDetailPage() {
  const { postSn } = useParams<{ postSn: string }>();
  const navigate   = useNavigate();

  const [item, setItem]       = useState<DataRoomItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postSn) return;
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/dataroom/${postSn}`);
        setItem(res.data);
      } catch (err) {
        console.error('자료실 상세 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [postSn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">자료를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="hidden md:block">
            <ServiceSidebar />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="border-b-2 border-gray-800 pb-2 mb-4">
              <h2 className="text-base font-extrabold text-gray-900">자료실</h2>
            </div>

            {/* 카테고리 + 제목 */}
            <div className="flex items-center gap-2 mt-3 mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 flex-shrink-0">
                {item.dataCtgNm}
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 leading-snug">{item.postSj}</h3>
            </div>

            {/* 등록일 + 접근권한 */}
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xs text-gray-400">등록일 : {item.regDt?.slice(0, 10).replace(/-/g, '.')}</p>
              {item.accsLmtCd === '02' && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">
                  회원전용
                </span>
              )}
            </div>

            {/* 본문 */}
            <div className="min-h-48 py-6 border-t border-b border-gray-200 mb-4">
              {item.postCn ? (
                <div
                  className="text-sm text-gray-700 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.postCn }}
                />
              ) : (
                <p className="text-sm text-gray-400">내용이 없습니다.</p>
              )}
            </div>

            {/* 첨부파일 */}
            {item.orgnFileNm && item.savePathNm && (
              <div className="mb-6 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
                <span className="text-sm text-gray-600 flex-1 truncate">{item.orgnFileNm}</span>
                <a
                  href={item.savePathNm}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-600 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50 transition-colors flex-shrink-0"
                >
                  다운로드
                </a>
              </div>
            )}

            {/* 목록 버튼 */}
            <button
              onClick={() => navigate('/customer/resource')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              전체목록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
