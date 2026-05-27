import { Link } from 'react-router-dom';

export default function FAQHeader({ subTitle }: { subTitle?: string }) {
  return (
    <div className="mb-4">
      {/* 타이틀 + 우측 브레드크럼 */}
      <div className="flex items-baseline justify-between mb-1">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
            자주하는 질문(<span className="text-blue-600">FAQ</span>)
          </h1>
          {subTitle && (
            <span className="text-xs text-gray-400">{subTitle}</span>
          )}
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Link to="/customer" className="hover:text-blue-500 transition-colors">
            고객센터
          </Link>
          <span>&gt;</span>
          <Link to="/customer/faq" className="hover:text-blue-500 transition-colors">
            자주하는 질문(FAQ)
          </Link>
        </div>
      </div>
      {/* 굵은 구분선 */}
      <hr className="border-t-2 border-gray-800 mt-2" />
    </div>
  );
}
