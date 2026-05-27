import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceSidebar from '../components/ServiceSidebar';
import FAQHeader from './components/FAQHeader';
import { useAuth } from '../../../auth/AuthContext';
import {
  type MainCategory,
  CATEGORY_CODE_MAP,
  SUB_CATEGORY_CODE_MAP,
  SUB_CATEGORIES,
} from './constants/faqConstants';
import api from '../../../api/api';

const API_BASE = 'http://localhost:8081';

export default function FaqWritePage() {
  const navigate = useNavigate();
  const { getUserId, getRole } = useAuth();
  const isAdmin = getRole()?.includes('ROLE_ADMIN') ?? false;

  const [activeMain, setActiveMain] = useState<MainCategory>('강의/교재');
  const [activeSub,  setActiveSub]  = useState<string>('수강신청');
  const [postSj,     setPostSj]     = useState('');
  const [postCn,     setPostCn]     = useState('');
  const [topFixYn,   setTopFixYn]   = useState('N');
  const [submitting, setSubmitting] = useState(false);

  // 대분류 변경 시 중분류 초기화
  const handleMainChange = (cat: MainCategory) => {
    setActiveMain(cat);
    setActiveSub(SUB_CATEGORIES[cat][1]); // 전체 제외 첫번째
  };

  const handleSubmit = async () => {
    if (!postSj.trim()) { alert('제목을 입력하세요.'); return; }
    if (!postCn.trim()) { alert('내용을 입력하세요.'); return; }

    setSubmitting(true);
    try {
      const res = await api.post('/api/faq', {
        wrtrUserId:  getUserId(),
        postSj:      postSj.trim(),
        postCn:      postCn.trim(),
        boardTypeCd: '01',
        faqCtgCd:    CATEGORY_CODE_MAP[activeMain],
        faqSubCtgCd: SUB_CATEGORY_CODE_MAP[activeSub],
        topFixYn,
        expsOrd:     0,
        });

    if (res.status === 200) {
    alert('FAQ가 등록되었습니다.');
    navigate('/customer/faq');
    
      } else {
        alert('등록에 실패했습니다.');
      }
    } catch (err) {
      console.error('FAQ 등록 실패:', err);
      alert('등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">접근 권한이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">
          <ServiceSidebar />

          <div className="flex-1 min-w-0">
            <FAQHeader />

            {/* 등록 폼 */}
            <div className="flex flex-col gap-4 mt-4">

              {/* 대분류 */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold text-gray-700 w-20 flex-shrink-0">
                  대분류 <span className="text-red-500">*</span>
                </label>
                <select
                  value={activeMain}
                  onChange={(e) => handleMainChange(e.target.value as MainCategory)}
                  className="border border-gray-300 rounded text-xs px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors"
                >
                  {Object.keys(CATEGORY_CODE_MAP).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* 중분류 */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold text-gray-700 w-20 flex-shrink-0">
                  중분류 <span className="text-red-500">*</span>
                </label>
                <select
                  value={activeSub}
                  onChange={(e) => setActiveSub(e.target.value)}
                  className="border border-gray-300 rounded text-xs px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors"
                >
                  {SUB_CATEGORIES[activeMain].filter(s => s !== '전체').map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* BEST 여부 */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold text-gray-700 w-20 flex-shrink-0">
                  BEST
                </label>
                <input
                  type="checkbox"
                  checked={topFixYn === 'Y'}
                  onChange={(e) => setTopFixYn(e.target.checked ? 'Y' : 'N')}
                  className="w-4 h-4 accent-blue-600"
                />
              </div>

              {/* 제목 */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold text-gray-700 w-20 flex-shrink-0">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={postSj}
                  onChange={(e) => setPostSj(e.target.value)}
                  placeholder="제목을 입력하세요."
                  className="flex-1 border border-gray-300 rounded text-xs px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* 내용 */}
              <div className="flex gap-4">
                <label className="text-xs font-semibold text-gray-700 w-20 flex-shrink-0 pt-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={postCn}
                  onChange={(e) => setPostCn(e.target.value)}
                  placeholder="내용을 입력하세요."
                  rows={10}
                  className="flex-1 border border-gray-300 rounded text-xs px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>

              {/* 버튼 */}
              <div className="flex justify-center gap-3 mt-2">
                <button
                  onClick={() => navigate('/customer/faq')}
                  className="px-6 py-2 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors disabled:opacity-50"
                >
                  {submitting ? '등록 중...' : '등록'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
