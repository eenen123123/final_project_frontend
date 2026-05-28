import { Link } from 'react-router-dom';

export default function NoticeHeader() {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
            공지사항
          </h1>
          <span className="text-xs text-gray-400">1:1 고객센터 공지 사항을 알려드립니다.</span>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Link to="/customer" className="hover:text-blue-500 transition-colors">고객센터</Link>
          <span>&gt;</span>
          <Link to="/customer/notice" className="hover:text-blue-500 transition-colors">공지사항</Link>
        </div>
      </div>
      <hr className="border-t-2 border-gray-800 mt-2" />
    </div>
  );
}
