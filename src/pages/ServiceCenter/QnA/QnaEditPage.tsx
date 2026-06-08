import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ServiceSidebar from "../components/ServiceSidebar";
import QnaHeader from "./components/QnaHeader";
import { useAuth } from "../../../auth/AuthContext";
import api from "../../../api/api";
import type { QnaItem } from "../../../types/board/QnaInterface";
import type { JSONContent } from "@tiptap/react";
import TipTapEditor from "../../../components/TipTapEditor/TipTapEditor";
import { extractFileIds, stripBlobUrls } from "../../../api/fileApi";

const QNA_CATEGORIES = [
  { code: "01", name: "수강문의" },
  { code: "02", name: "결제문의" },
  { code: "03", name: "기타" },
];

export default function QnaEditPage() {
  const { postSn } = useParams<{ postSn: string }>();
  const navigate = useNavigate();
  const { getUserId } = useAuth();

  const [form, setForm] = useState<{
    qnaCtgCd: string;
    secrYn: string;
    postSj: string;
    postCn: JSONContent | null;
    wrtrUserId: string;
  }>({
    qnaCtgCd: "01",
    secrYn: "N",
    postSj: "",
    postCn: null,
    wrtrUserId: getUserId() ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasPendingUploads, setHasPendingUploads] = useState(false);

  useEffect(() => {
    if (!postSn) return;
    const fetchQna = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/qna/${postSn}`);
        const data: QnaItem = res.data;

        if (data.wrtrUserId !== getUserId()) {
          alert("수정 권한이 없습니다.");
          navigate(`/customer/qna/${postSn}`);
          return;
        }

        setForm({
          qnaCtgCd: data.qnaCtgCd,
          secrYn: data.secrYn,
          postSj: data.postSj,
          postCn:
            typeof data.postCn === "string"
              ? JSON.parse(data.postCn)
              : data.postCn,
          wrtrUserId: data.wrtrUserId,
        });
      } catch (err) {
        console.error("QnA 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQna();
  }, [postSn]);

  const isEmpty =
    !form.postCn || !form.postCn.content?.some((n) => n.content?.length);

  const handleSubmit = async () => {
    if (!form.postSj.trim()) return alert("제목을 입력하세요.");
    if (isEmpty) return alert("내용을 입력하세요.");
    if (hasPendingUploads)
      return alert("이미지 업로드가 완료될 때까지 기다려주세요.");

    const cleanContent = stripBlobUrls(form.postCn!);
    const fileIds = extractFileIds(cleanContent);

    setSubmitting(true);
    try {
      await api.put(`/api/qna/${postSn}`, {
        ...form,
        postCn: JSON.stringify(cleanContent),
        fileIds,
      });
      alert("수정되었습니다.");
      navigate(`/customer/qna/${postSn}`);
    } catch (err) {
      console.error("QnA 수정 실패:", err);
      alert("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="hidden md:block">
            <ServiceSidebar />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <QnaHeader title="Q&A 수정" />

            <div className="mt-5">
              {/* 카테고리 */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  분류 <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.qnaCtgCd}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, qnaCtgCd: e.target.value }))
                  }
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
                  value={form.postSj}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, postSj: e.target.value }))
                  }
                  placeholder="제목을 입력하세요."
                  className="w-full border border-gray-300 rounded text-sm px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* 내용 - 데이터 로드 후 에디터 마운트 */}
              {form.postCn !== null && (
                <TipTapEditor
                  initialContent={form.postCn}
                  onChange={(json, pending) => {
                    setForm((prev) => ({ ...prev, postCn: json }));
                    setHasPendingUploads(pending);
                  }}
                  ctxType="POST"
                  ctxId={postSn ?? "0"}
                  maxImages={5}
                />
              )}

              {/* 비공개 여부 */}
              <div className="mt-4 mb-6 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="secrYn"
                  checked={form.secrYn === "Y"}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      secrYn: prev.secrYn === "Y" ? "N" : "Y",
                    }))
                  }
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

              {/* 버튼 */}
              <div className="flex items-center justify-center gap-3 border-t border-gray-200 pt-5">
                <button
                  onClick={() => navigate(`/customer/qna/${postSn}`)}
                  className="px-6 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "수정 중..." : "수정"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
