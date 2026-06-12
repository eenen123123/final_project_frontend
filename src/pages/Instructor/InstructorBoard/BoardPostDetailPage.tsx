import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { formatPostDate } from "../InstructorDetail/utils";
import TipTapEditor from "../../../components/TipTapEditor/TipTapEditor";
import type { JSONContent } from "@tiptap/react";

interface AttachedFile {
  fileSn: number;
  originalFileName: string;
  fileUrl: string;
}

interface BoardPostDetail {
  postSn: number;
  boardTypeCd: string;
  title: string;
  content: JSONContent | undefined;
  writerName: string;
  regDt: string;
  viewCount: number;
  hasFile: "Y" | "N";
  answerYn: "Y" | "N";
  answerContent: string | null;
  answererName: string | null;
  answerDt: string | null;
  prevPost: { postSn: number; title: string } | null;
  nextPost: { postSn: number; title: string } | null;
  files: AttachedFile[] | null;
}

export default function BoardPostDetailPage() {
  const { instrUuid, boardType, postSn } = useParams<{
    instrUuid: string;
    boardType: string;
    postSn: string;
  }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BoardPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!instrUuid || !postSn) return;
    let cancelled = false;
    api
      .get<BoardPostDetail>(`/api/instructors/${instrUuid}/board/${postSn}`)
      .then((res) => {
        if (!cancelled) setPost(res.data);
      })
      .catch((e) => {
        if (!cancelled) console.error("게시글 상세 조회 실패", e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [instrUuid, postSn]);

  const backPath = `/instructor/${instrUuid}/${boardType}`;

  if (loading) {
    return <p className="text-sm text-gray-400">불러오는 중...</p>;
  }

  if (!post) {
    return <p className="text-sm text-gray-400">게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      {/* 제목 + 메타 */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">
          {post.title}
        </h2>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{post.writerName}</span>
          <span>{formatPostDate(post.regDt)}</span>
          <span>조회 {post.viewCount}</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="min-h-40 py-4 border-b border-gray-100 mb-6 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
        {post.content ? (
          <TipTapEditor initialContent={post.content} editable={false} />
        ) : (
          <span className="text-gray-400">내용이 없습니다.</span>
        )}
      </div>

      {/* 첨부파일 */}
      {post.hasFile === "Y" && post.files && post.files.length > 0 && (
        <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 mb-2">첨부파일</p>
          <ul className="space-y-1">
            {post.files.map((file) => (
              <li key={file.fileSn}>
                <a
                  href={file.fileUrl}
                  download={file.originalFileName}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {file.originalFileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* QnA 답변 */}
      {boardType === "qna" &&
        (post.answerYn === "Y" && post.answerContent ? (
          <div className="mb-6 border border-blue-100 rounded">
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-3">
              <span className="text-xs font-bold text-blue-600">강사 답변</span>
              {post.answererName && (
                <span className="text-xs text-gray-500">
                  {post.answererName}
                </span>
              )}
              {post.answerDt && (
                <span className="text-xs text-gray-400">
                  {formatPostDate(post.answerDt)}
                </span>
              )}
            </div>
            <div className="px-4 py-5 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {post.answerContent}
            </div>
          </div>
        ) : (
          <div className="mb-6 border border-gray-100 rounded px-4 py-6 text-center bg-gray-50">
            <p className="text-xs text-gray-400">
              아직 답변이 등록되지 않았습니다.
            </p>
          </div>
        ))}

      {/* 목록 버튼 */}
      <div className="mb-6">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          목록
        </button>
      </div>

      {/* 이전글 / 다음글 */}
      <div className="border-t border-gray-200">
        <div
          onClick={() =>
            post.prevPost &&
            navigate(
              `/instructor/${instrUuid}/${boardType}/${post.prevPost.postSn}`,
            )
          }
          className={`flex items-center gap-3 px-3 py-3 border-b border-gray-100 transition-colors ${
            post.prevPost ? "hover:bg-gray-50 cursor-pointer" : "opacity-40"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
          <span className="text-xs text-gray-400 w-12 shrink-0">이전글</span>
          <span className="text-sm text-gray-500 truncate">
            {post.prevPost ? post.prevPost.title : "이전 글이 없습니다."}
          </span>
        </div>
        <div
          onClick={() =>
            post.nextPost &&
            navigate(
              `/instructor/${instrUuid}/${boardType}/${post.nextPost.postSn}`,
            )
          }
          className={`flex items-center gap-3 px-3 py-3 transition-colors ${
            post.nextPost ? "hover:bg-gray-50 cursor-pointer" : "opacity-40"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
          <span className="text-xs text-gray-400 w-12 shrink-0">다음글</span>
          <span className="text-sm text-gray-500 truncate">
            {post.nextPost ? post.nextPost.title : "다음 글이 없습니다."}
          </span>
        </div>
      </div>
    </div>
  );
}
