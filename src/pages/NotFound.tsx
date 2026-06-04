import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="text-amber-400 text-xl font-semibold tracking-widest mb-3">
          Hermes
        </p>
        <h1 className="text-8xl font-bold text-blue-950 mb-4">404</h1>
        <p className="text-2xl font-semibold text-slate-700 mb-2">
          페이지를 찾을 수 없습니다
        </p>
        <p className="text-slate-500 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-950 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors cursor-pointer"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
