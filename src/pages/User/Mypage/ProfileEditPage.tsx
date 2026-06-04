import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WithdrawSection from "./components/WithdrawSection";
import api from "../../../api/api";
import { useAuth } from "../../../auth/AuthContext";

interface ProfileData {
  userId: string;
  userName: string;
  userGndrCd: string;
  userBrdt: string;
  userTelno: string;
  userEmailAddr: string;
  userZip: string;
  userAddr: string;
  userDaddr: string;
  userProfile: string | null;
}

type ActiveMenu = "profile" | "password" | "withdraw";

const genderLabel: Record<string, string> = {
  M: "남성",
  F: "여성",
  U: "미확인",
};

const NAV_ITEMS: { key: ActiveMenu; label: string }[] = [
  { key: "profile", label: "개인정보 수정" },
  { key: "password", label: "비밀번호 변경" },
  { key: "withdraw", label: "회원 탈퇴" },
];

const EyeIcon = ({ show }: { show: boolean }) => (
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
    {show ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { getUserName, getUserId } = useAuth();
  const userName = getUserName();
  const userId = getUserId();
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>("profile");

  const [profileData, setProfileData] = useState<ProfileData>({
    userId: userId ?? "",
    userName: userName ?? "",
    userGndrCd: "",
    userBrdt: "",
    userTelno: "",
    userEmailAddr: "",
    userZip: "",
    userAddr: "",
    userDaddr: "",
    userProfile: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const isWithdraw = activeMenu === "withdraw";
  const accentColor = isWithdraw ? "#EF4444" : "#3B82F6";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/mypage/profile");
        setProfileData(res.data);
        if (res.data.userProfile) setPreviewImage(res.data.userProfile);
      } catch {
        console.error("프로필 정보 불러오기 실패");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validateProfile = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!profileData.userTelno) {
      newErrors.userTelno = "전화번호를 입력해주세요.";
    } else if (!/^010-\d{3,4}-\d{4}$/.test(profileData.userTelno)) {
      newErrors.userTelno = "010-0000-0000 형식으로 입력해주세요.";
    }
    if (!profileData.userEmailAddr) {
      newErrors.userEmailAddr = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.userEmailAddr)) {
      newErrors.userEmailAddr = "올바른 이메일 형식으로 입력해주세요.";
    }
    if (!profileData.userZip) newErrors.userZip = "우편번호를 검색해주세요.";
    if (!profileData.userAddr) newErrors.userAddr = "주소를 입력해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!newPassword) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요.";
    } else if (newPassword.length < 8 || newPassword.length > 20) {
      newErrors.newPassword = "비밀번호는 8자 이상 20자 이하로 입력해주세요.";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitProfile = async () => {
    if (!validateProfile()) return;
    setIsLoading(true);
    setSuccessMsg("");
    try {
      const formData = new FormData();
      formData.append("userTelno", profileData.userTelno);
      formData.append("userEmailAddr", profileData.userEmailAddr);
      formData.append("userZip", profileData.userZip);
      formData.append("userAddr", profileData.userAddr);
      formData.append("userDaddr", profileData.userDaddr);
      if (profileFile) formData.append("profileImage", profileFile);
      await api.put("/api/mypage/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("개인정보가 성공적으로 수정되었습니다.");
      setProfileFile(null);
    } catch {
      setErrors({ submit: "저장에 실패했습니다. 다시 시도해주세요." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPassword = async () => {
    if (!validatePassword()) return;
    setIsLoading(true);
    setSuccessMsg("");
    try {
      const formData = new FormData();
      formData.append("newPassword", newPassword);
      await api.put("/api/mypage/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("비밀번호가 성공적으로 변경되었습니다.");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErrors({ submit: "저장에 실패했습니다. 다시 시도해주세요." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = () => {
    // TODO: 회원 탈퇴 API 연동
    alert("회원 탈퇴 API 연동 필요");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
          <button
            onClick={() => navigate("/mypage")}
            className="hover:text-gray-600 transition-colors flex items-center gap-1"
          >
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
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            마이페이지
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">개인정보 수정</span>
        </div>

        <div className="flex gap-5 items-start">
          {/* 사이드바 */}
          <div className="w-44 flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-5 border-b border-gray-100 text-center">
              <div className="relative inline-block mb-3">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border-2"
                  style={{ borderColor: accentColor, background: isWithdraw ? "#FEF2F2" : "#EBF5FF" }}
                >
                  {previewImage ? (
                    <img src={previewImage} alt="프로필" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold" style={{ color: isWithdraw ? "#991B1B" : "#1D4ED8" }}>
                      {initial}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                  style={{ background: accentColor }}
                  aria-label="프로필 사진 변경"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-sm font-semibold text-gray-900">{profileData.userName || userName}</p>
              <p className="text-xs text-gray-400 mt-0.5">일반 회원</p>
            </div>
            <nav className="py-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeMenu === item.key;
                const itemColor = item.key === "withdraw" ? "#EF4444" : "#3B82F6";
                const itemBg = item.key === "withdraw" ? "#FEF2F2" : "#EBF5FF";
                const itemText = item.key === "withdraw" ? "#991B1B" : "#1D4ED8";
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveMenu(item.key);
                      setSuccessMsg("");
                      setErrors({});
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                    style={{
                      borderLeft: isActive ? `3px solid ${itemColor}` : "3px solid transparent",
                      background: isActive ? itemBg : "transparent",
                      color: isActive ? itemText : "#6B7280",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 min-w-0 space-y-3">
            {successMsg && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {successMsg}
              </div>
            )}
            {errors.submit && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.submit}
              </div>
            )}

            {/* 개인정보 수정 */}
            {activeMenu === "profile" && (
              <>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-0.5 h-4 rounded-full" style={{ background: accentColor }}></div>
                    <p className="text-sm font-medium text-gray-900">기본 정보</p>
                  </div>
                  <div className="px-5 divide-y divide-gray-50">
                    {[
                      { label: "아이디", value: profileData.userId || userId },
                      { label: "이름", value: profileData.userName || userName },
                      { label: "성별", value: genderLabel[profileData.userGndrCd] ?? "-" },
                      { label: "생년월일", value: profileData.userBrdt || "-" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center py-3">
                        <span className="w-24 text-xs text-gray-400 flex-shrink-0">{label}</span>
                        <span className="text-sm text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-0.5 h-4 rounded-full" style={{ background: accentColor }}></div>
                    <p className="text-sm font-medium text-gray-900">연락처</p>
                  </div>
                  <div className="px-5 divide-y divide-gray-50">
                    <div className="flex items-center py-3 gap-3">
                      <span className="w-24 text-xs text-gray-400 flex-shrink-0">전화번호</span>
                      <div>
                        <input
                          type="tel"
                          value={profileData.userTelno}
                          onChange={(e) => handleChange("userTelno", e.target.value)}
                          placeholder="010-0000-0000"
                          className={`w-56 text-sm ${errors.userTelno ? "border-red-300" : ""}`}
                        />
                        {errors.userTelno && <p className="mt-1 text-xs text-red-500">{errors.userTelno}</p>}
                      </div>
                    </div>
                    <div className="flex items-center py-3 gap-3">
                      <span className="w-24 text-xs text-gray-400 flex-shrink-0">이메일</span>
                      <div>
                        <input
                          type="email"
                          value={profileData.userEmailAddr}
                          onChange={(e) => handleChange("userEmailAddr", e.target.value)}
                          placeholder="example@email.com"
                          className={`w-72 text-sm ${errors.userEmailAddr ? "border-red-300" : ""}`}
                        />
                        {errors.userEmailAddr && <p className="mt-1 text-xs text-red-500">{errors.userEmailAddr}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-0.5 h-4 rounded-full" style={{ background: accentColor }}></div>
                    <p className="text-sm font-medium text-gray-900">주소</p>
                  </div>
                  <div className="px-5 divide-y divide-gray-50">
                    <div className="flex items-center py-3 gap-3">
                      <span className="w-24 text-xs text-gray-400 flex-shrink-0">우편번호</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={profileData.userZip}
                          readOnly
                          placeholder="우편번호"
                          className="w-24 text-sm bg-gray-50"
                        />
                        <button
                          onClick={() => alert("우편번호 검색 API 연동 필요")}
                          className="px-3 py-1.5 text-xs text-white rounded font-medium"
                          style={{ background: accentColor }}
                        >
                          검색
                        </button>
                      </div>
                      {errors.userZip && <p className="text-xs text-red-500">{errors.userZip}</p>}
                    </div>
                    <div className="flex items-center py-3 gap-3">
                      <span className="w-24 text-xs text-gray-400 flex-shrink-0">주소</span>
                      <input
                        type="text"
                        value={profileData.userAddr}
                        readOnly
                        placeholder="주소 검색 후 자동 입력"
                        className="flex-1 text-sm bg-gray-50"
                      />
                    </div>
                    <div className="flex items-center py-3 gap-3">
                      <span className="w-24 text-xs text-gray-400 flex-shrink-0">상세주소</span>
                      <input
                        type="text"
                        value={profileData.userDaddr}
                        onChange={(e) => handleChange("userDaddr", e.target.value)}
                        placeholder="상세주소를 입력해주세요"
                        className="flex-1 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => navigate("/mypage")}
                    className="px-6 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmitProfile}
                    disabled={isLoading}
                    className="px-6 py-2 text-sm font-medium text-white rounded transition-colors"
                    style={{ background: isLoading ? "#93C5FD" : accentColor }}
                  >
                    {isLoading ? "저장 중..." : "저장"}
                  </button>
                </div>
              </>
            )}

            {/* 비밀번호 변경 */}
            {activeMenu === "password" && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-0.5 h-4 rounded-full" style={{ background: accentColor }}></div>
                  <p className="text-sm font-medium text-gray-900">비밀번호 변경</p>
                </div>
                <div className="px-5 divide-y divide-gray-50">
                  <div className="flex items-center py-3 gap-3">
                    <span className="w-28 text-xs text-gray-400 flex-shrink-0">새 비밀번호</span>
                    <div>
                      <div className="relative">
                        <input
                          type={showNewPw ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setErrors((p) => ({ ...p, newPassword: "" }));
                          }}
                          placeholder="8자 이상 20자 이하"
                          className={`w-72 text-sm pr-9 ${errors.newPassword ? "border-red-300" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw((p) => !p)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                          aria-label="비밀번호 표시"
                        >
                          <EyeIcon show={showNewPw} />
                        </button>
                      </div>
                      {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>}
                    </div>
                  </div>
                  <div className="flex items-center py-3 gap-3">
                    <span className="w-28 text-xs text-gray-400 flex-shrink-0">비밀번호 확인</span>
                    <div>
                      <div className="relative">
                        <input
                          type={showConfirmPw ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors((p) => ({ ...p, confirmPassword: "" }));
                          }}
                          placeholder="비밀번호를 다시 입력해주세요"
                          className={`w-72 text-sm pr-9 ${errors.confirmPassword ? "border-red-300" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw((p) => !p)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                          aria-label="비밀번호 확인 표시"
                        >
                          <EyeIcon show={showConfirmPw} />
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-4">
                  <button
                    onClick={() => navigate("/mypage")}
                    className="px-6 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmitPassword}
                    disabled={isLoading}
                    className="px-6 py-2 text-sm font-medium text-white rounded transition-colors"
                    style={{ background: isLoading ? "#93C5FD" : accentColor }}
                  >
                    {isLoading ? "변경 중..." : "변경"}
                  </button>
                </div>
              </div>
            )}

            {/* 회원 탈퇴 */}
            {activeMenu === "withdraw" && <WithdrawSection onWithdraw={handleWithdraw} />}
          </div>
        </div>
      </div>
    </div>
  );
}
