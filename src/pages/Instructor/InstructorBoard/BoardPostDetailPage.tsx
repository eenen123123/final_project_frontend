import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../../api/api";
import { formatPostDate } from "../InstructorDetail/utils";
import { useAuth } from "../../../auth/AuthContext";
import { getFilesToken } from "../../../api/fileApi";
import { processHtml } from "../../../utils/renderHtml";

interface AttachedFile {
  atchFileDtlSn: number;
  fileName: string;
  fileUrl: string;
}

interface BoardPostDetail {
  postSn: number;
  boardTypeCd: string;
  title: string;
  content: string | null;
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
  myPost: boolean;
}

export default function BoardPostDetailPage() {
  const { instrUuid, boardType, postSn } = useParams<{
    instrUuid: string;
    boardType: string;
    postSn: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<BoardPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [resolvedContent, setResolvedContent] = useState<string | null>(null);
  const [fileTokenMap, setFileTokenMap] = useState<Record<number, string>>({});

  useEffect(() => {
    if (boardType === "dataroom" && !isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!instrUuid || !postSn) return;
    let cancelled = false;
    api
      .get<BoardPostDetail>(`/api/instructors/${instrUuid}/board/${postSn}`)
      .then((res) => {
        if (cancelled) return;
        setPost(res.data);

        // 첨부파일 토큰
        const files = res.data.files ?? [];
        if (files.length > 0) {
          const fileServerIds = files
            .map((f: AttachedFile) => {
              const m = f.fileUrl.match(/\/files\/(\d+)\//);
              return m ? Number(m[1]) : null;
            })
            .filter((id): id is number => id !== null);
          if (fileServerIds.length > 0) {
            getFilesToken(fileServerIds)
              .then((map) => { if (!cancelled) setFileTokenMap(map); })
              .catch(() => {});
          }
        }

        const html = res.data.content ?? "";
        const fileIds = [...html.matchAll(/data-file-id="(\d+)"/g)].map((m) =>
          Number(m[1]),
        );

        if (fileIds.length === 0) {
          setResolvedContent(processHtml(html));
          return;
        }

        getFilesToken(fileIds)
          .then((tokenMap) => {
            if (cancelled) return;
            const injected = html.replace(
              /(<img[^>]*data-file-id="(\d+)"[^>]*)(\/?>)/g,
              (_match, before, id, close) => {
                const url = tokenMap[Number(id)];
                return url ? `${before} src="${url}"${close}` : `${before}${close}`;
              },
            );
            setResolvedContent(processHtml(injected));
          })
          .catch(() => setResolvedContent(html));
      })
      .catch((e) => {
        if (cancelled) return;
        const status = e?.response?.status;
        if (status === 403 || status === 401) setAccessDenied(true);
        console.error("게시글 상세 조회 실패", e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [instrUuid, postSn, boardType, isAuthenticated, navigate, location]);

  const backPath = `/instructor/${instrUuid}/${boardType}`;

  if (boardType === "dataroom" && !isAuthenticated) {
    return null;
  }

  if (loading) {
    return <p className="text-sm text-gray-400">불러오는 중...</p>;
  }

  if (accessDenied) {
    return <p className="text-sm text-gray-400">비밀글입니다. 작성자만 열람할 수 있습니다.</p>;
  }

  if (!post) {
    return <p className="text-sm text-gray-400">게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      {/* 제목 + 메타 */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">
          <span dangerouslySetInnerHTML={{ __html: processHtml(post.title) }} />
        </h2>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{post.writerName}</span>
          <span>{formatPostDate(post.regDt)}</span>
          <span>조회 {post.viewCount}</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="min-h-40 py-4 border-b border-gray-100 mb-6 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
        {resolvedContent ? (
          <div dangerouslySetInnerHTML={{ __html: resolvedContent }} />
        ) : (
          <span className="text-gray-400">내용이 없습니다.</span>
        )}
      </div>

      {/* 첨부파일 */}
      {post.hasFile === "Y" && post.files && post.files.length > 0 && (
        <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 mb-2">첨부파일</p>
          <ul className="space-y-1">
            {post.files.map((file) => {
              const m = file.fileUrl.match(/\/files\/(\d+)\//);
              const fileServerId = m ? Number(m[1]) : null;
              const tokenUrl = fileServerId ? fileTokenMap[fileServerId] : null;
              const handleDownload = async () => {
                const url = tokenUrl ?? file.fileUrl;
                try {
                  const res = await fetch(url);
                  const blob = await res.blob();
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = file.fileName;
                  a.click();
                  URL.revokeObjectURL(a.href);
                } catch {
                  window.open(url, "_blank");
                }
              };
              return (
                <li key={file.atchFileDtlSn}>
                  <button
                    onClick={handleDownload}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    {file.fileName}
                  </button>
                </li>
              );
            })}
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
            <div
              className="px-4 py-5 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: processHtml(post.answerContent) }}
            />
          </div>
        ) : (
          <div className="mb-6 border border-gray-100 rounded px-4 py-6 text-center bg-gray-50">
            <p className="text-xs text-gray-400">
              아직 답변이 등록되지 않았습니다.
            </p>
          </div>
        ))}

      {/* 목록 / 수정·삭제 버튼 */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          목록
        </button>

        {boardType === "qna" && post.myPost && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/instructor/${instrUuid}/qna/${post.postSn}/edit`)}
              className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              수정
            </button>
            <button
              onClick={async () => {
                if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
                try {
                  await api.delete(`/api/instructors/${instrUuid}/board/${post.postSn}`);
                  navigate(backPath, { replace: true });
                } catch {
                  alert("삭제에 실패했습니다.");
                }
              }}
              className="px-4 py-2 border border-red-200 rounded text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              삭제
            </button>
          </div>
        )}
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
