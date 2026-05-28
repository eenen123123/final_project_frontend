import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceSidebar from "../components/ServiceSidebar";
import QnaHeader from "./components/QnaHeader";
import { useAuth } from "../../../auth/AuthContext";
import api from "../../../api/api";
import type { QnaCreateRequest } from "../../../types/board/QnaInterface";

const QNA_CATEGORIES = [
  { code: "01", name: "수강문의" },
  { code: "02", name: "결제문의" },
  { code: "03", name: "기타" },
];

const NOTI_OPTIONS = [
  { id: "noti-kakao", label: "카카오톡 알림 받기" },
  { id: "noti-sms", label: "SMS 알림 받기" },
  { id: "noti-none", label: "선택 안함" },
  { id: "noti-admin", label: "관리자 페이지에서 알람전송 구현" },
];

export default function QnaWritePage() {
  const navigate = useNavigate();
  const { getUserId } = useAuth();

  const [form, setForm] = useState<QnaCreateRequest>({
    qnaCtgCd: "01",
    secrYn: "N",
    postSj: "",
    postCn: "",
    wrtrUserId: getUserId() ?? "",
  });
  const [notiType, setNotiType] = useState("noti-none");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecrToggle = () => {
    setForm((prev) => ({ ...prev, secrYn: prev.secrYn === "Y" ? "N" : "Y" }));
  };

  const handleSubmit = async () => {
    if (!form.postSj.trim()) {
      alert("제목을 입력하세요.");
      return;
    }
    if (!form.postCn.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/qna", form);
      alert("질문이 등록되었습니다.");
      navigate("/customer/qna");
    } catch (err) {
      console.error("QnA 등록 실패:", err);
      alert("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* 사이드바: 모바일에서 숨김 */}
          <div className="hidden md:block">
            <ServiceSidebar />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <QnaHeader />

            <div className="mt-5">
              {/* 카테고리 */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  분류 <span className="text-red-400">*</span>
                </label>
                <select
                  name="qnaCtgCd"
                  value={form.qnaCtgCd}
                  onChange={handleChange}
                  className="border border-gray-300 rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors cursor-pointer w-40"
                >
                  {QNA_CATEGORIES.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 제목 */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  제목 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="postSj"
                  value={form.postSj}
                  onChange={handleChange}
                  placeholder="제목을 입력하세요."
                  className="w-full border border-gray-300 rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* 내용 */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  내용 <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="postCn"
                  value={form.postCn}
                  onChange={handleChange}
                  placeholder="문의 내용을 입력하세요."
                  rows={10}
                  className="w-full border border-gray-300 rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>

              {/* 비공개 여부 */}
              <div className="mb-5 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="secrYn"
                  checked={form.secrYn === "Y"}
                  onChange={handleSecrToggle}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <label
                  htmlFor="secrYn"
                  className="text-xs text-gray-600 cursor-pointer flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  비공개 글로 등록
                </label>
              </div>

              {/* 답변 알림 */}
              <div className="mb-6 border border-gray-200 rounded p-4">
                <label className="block text-xs font-semibold text-gray-700 mb-3">
                  답변 알림 (추후에 구현예정)
                </label>
                <div className="flex flex-wrap gap-4">
                  {NOTI_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      htmlFor={opt.id}
                      className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer"
                    >
                      <input
                        type="radio"
                        id={opt.id}
                        name="notiType"
                        value={opt.id}
                        checked={notiType === opt.id}
                        onChange={() => setNotiType(opt.id)}
                        className="accent-blue-600 cursor-pointer"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex items-center justify-center gap-3 border-t border-gray-200 pt-5">
                <button
                  onClick={() => navigate("/customer/qna")}
                  className="px-6 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "등록 중..." : "등록"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
