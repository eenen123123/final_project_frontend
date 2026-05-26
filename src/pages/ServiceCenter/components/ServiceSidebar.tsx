import { Link, useLocation } from 'react-router-dom';

const NAV = [
  {
    label: '자주하는 질문 FAQ',
    to: '/customer/faq',
  },
  {
    label: '학습 이용 가이드',
    children: [
      { label: '수강 준비하기', to: '/customer/guide/prepare' },
      { label: '수강 알아보기', to: '/customer/guide/info' },
      { label: '수강 시작하기', to: '/customer/guide/start' },
      { label: '수강 활용하기', to: '/customer/guide/use' },
    ],
  },
  {
    label: 'Q&A',
    children: [
      { label: '질문 등록하기', to: '/customer/qna' },
      { label: '나의 문의내역', to: '/customer/qna' },
    ],
  },
  {
    label: '공지사항',
    to: '/customer/notice',
  },
  {
    label: 'Q&A',
    to: '/customer/qna',
  },
  {
    label: '자료실',
    to: '/customer/resource',
  },
];

export default function ServiceSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-52 flex-shrink-0">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        
        <div className="border-b border-gray-100 bg-gray-50">
          <Link 
            to="/customer" 
            className="block px-5 pt-4 pb-2.5 text-lg font-extrabold text-gray-900 hover:text-blue-600 transition-colors"
          >
            고객센터
          </Link>
        </div>

        {/* 💡 변경 2: nav의 상단 패딩을 pt-1로 줄여 아래 메뉴들을 위로 밀착시킴 */}
        <nav className="pt-1 pb-2">
          {NAV.map((item, idx) => (
            <div key={idx} className="py-1">
              {item.to ? (
                <Link
                  to={item.to}
                  className={`block px-5 py-2.5 text-sm font-semibold transition-colors ${
                    pathname === item.to
                      ? 'text-blue-600 bg-blue-50/70 font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <div>
                  <p className="px-5 py-2.5 text-sm font-semibold text-gray-700">
                    {item.label}
                  </p>
                  {item.children?.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className={`block px-8 py-2 text-xs transition-colors ${
                        pathname === child.to
                          ? 'text-blue-600 font-bold bg-blue-50/30'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 환불/취소 안내 버튼 */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <button className="w-full py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm">
            환불/취소 안내
          </button>
        </div>
      </div>
    </aside>
  );
}