import type { ReactNode } from 'react';

type MainCategory = '강의/교재' | '결제' | '학습기기' | '동영상' | '도서';

interface FAQCategoryTabsProps {
  activeMain: MainCategory;
  activeSub: string;
  onMainChange: (cat: MainCategory) => void;
  onSubChange: (sub: string) => void;
}

const MAIN_CATEGORIES: { label: MainCategory; icon: ReactNode }[] = [
  {
    label: '강의/교재',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    label: '결제',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 7.5h19m-19 4h19m-19 5h14m1.5-11.5h-16A2.5 2.5 0 0 0 1.5 7.5v9A2.5 2.5 0 0 0 4.5 19h16a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 20.5 5Z" />
      </svg>
    ),
  },
  {
    label: '학습기기',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v15a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    label: '동영상',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
      </svg>
    ),
  },
  {
    label: '도서',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

const SUB_CATEGORIES: Record<MainCategory, string[]> = {
  '강의/교재': ['전체', '수강신청', '수강기간', '교재', '환불/취소'],
  '결제':     ['전체', '결제수단', '영수증', '쿠폰/포인트'],
  '학습기기':  ['전체', '기기등록', '앱설치', '오류'],
  '동영상':   ['전체', '플레이어 기능', '플레이어 설치', '플레이어 재생'],
  '도서':     ['전체', '주문', '배송', '반품/교환'],
};

export default function FAQCategoryTabs({
  activeMain,
  activeSub,
  onMainChange,
  onSubChange,
}: FAQCategoryTabsProps) {
  return (
    <>
      {/* 대분류 탭 */}
      <div className="grid grid-cols-5 mb-5 select-none">
        {MAIN_CATEGORIES.map(({ label, icon }) => {
          const isActive = activeMain === label;
          return (
            <button
              key={label}
              onClick={() => onMainChange(label)}
              className={`flex flex-col items-center justify-center py-4 border -ml-px -mt-px text-xs transition-all ${
                isActive
                  ? 'border-blue-600 z-10 text-blue-600 font-bold bg-white shadow-[0_0_0_1px_rgba(37,99,235,1)]'
                  : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mb-1.5 text-current opacity-85">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* 중분류 탭 */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 pl-1 select-none">
        {SUB_CATEGORIES[activeMain].map((sub) => {
          const isActive = activeSub === sub;
          return (
            <button
              key={sub}
              onClick={() => onSubChange(sub)}
              className={`text-xs transition-colors py-1 ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-gray-400 font-medium hover:text-gray-700'
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>
    </>
  );
}
