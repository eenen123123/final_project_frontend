import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/api";

export default function VerifyPasswordPage() {
  const navigate = useNavigate();
  const { getUserName, getUserId } = useAuth();

  const userName = getUserName();
  const userId = getUserId();
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post("/api/mypage/verify-password", { password });
      navigate("/mypage/profile/edit");
    } catch {
      setError("비밀번호가 일치하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 pt-24">
      <div className="w-full max-w-md">
        {/* 상단 아이콘 + 안내 문구 */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 mb-1">개인정보 보호 확인</h1>
          <p className="text-sm text-gray-500">개인정보 보호를 위해 비밀번호를 한번 더 입력해주세요.</p>
        </div>

        {/* 카드 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* 유저 정보 */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-5">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-blue-600">{initial}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{userName ?? "-"}</p>
              <p className="text-xs text-gray-400">{userId ?? "-"}</p>
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">현재 비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호를 입력해주세요"
                className={`w-full px-3 py-2.5 pr-10 text-sm border rounded-lg outline-none transition-colors ${
                  error
                    ? "border-red-300 focus:border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-blue-400 bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="비밀번호 표시 토글"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* 확인 버튼 */}
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isLoading ? "확인 중..." : "확인"}
          </button>

          {/* 돌아가기 */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/mypage")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 mx-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              마이페이지로 돌아가기
            </button>
          </div>
        </div>

        {/* 하단 안내 */}
        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          입력하신 비밀번호는 안전하게 처리됩니다.
        </p>
      </div>
    </div>
  );
}
