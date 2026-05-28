import { Link } from 'react-router-dom';

export default function QnaHeader() {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Q&A</h1>
          <span className="text-xs text-gray-400">궁금한 내용을 남겨주시면, 자세히 답변 드립니다.</span>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Link to="/customer" className="hover:text-blue-500 transition-colors">고객센터</Link>
          <span>&gt;</span>
          <Link to="/customer/qna" className="hover:text-blue-500 transition-colors">Q&A</Link>
        </div>
      </div>
      <hr className="border-t-2 border-gray-800 mt-2" />
    </div>
  );
}
