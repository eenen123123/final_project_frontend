import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { formatPostDate, isNewPost } from "../InstructorDetail/utils";
import { processHtml } from "../../../utils/renderHtml";
import { useAuth } from "../../../auth/AuthContext";

interface BoardPost {
  postSn: number;
  title: string;
  regDt: string;
  viewCount: number;
  writerName: string;
  answerYn: "Y" | "N" | null;
  hasFile: "Y" | "N";
  secrYn: "Y" | "N";
}

interface BoardResponse {
  items: BoardPost[];
  totalCount: number;
}

interface Props {
  boardType: "notice" | "qna" | "dataroom";
  title: string;
}

const PAGE_SIZE = 10;
const BLOCK_SIZE = 5;

export default function BoardTab({ boardType, title }: Props) {
  const { instrUuid } = useParams<{ instrUuid: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(!!instrUuid);
  const [searchCategory, setSearchCategory] = useState("title");
  const [keyword, setKeyword] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("title");
  const [appliedKeyword, setAppliedKeyword] = useState("");

  useEffect(() => {
    if (!instrUuid) return;
    let cancelled = false;
    const params = new URLSearchParams({
      page: String(page),
      size: String(PAGE_SIZE),
    });
    if (appliedKeyword) {
      params.set("searchType", appliedCategory);
      params.set("keyword", appliedKeyword);
    }
    api
      .get<BoardResponse>(`/api/instructors/${instrUuid}/board/${boardType}?${params}`)
      .then((res) => {
        if (cancelled) return;
        setPosts(res.data.items);
        setTotalCount(res.data.totalCount);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        console.error(`${boardType} 목록 조회 실패`, e);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [instrUuid, boardType, page, appliedKeyword, appliedCategory]);

  const filtered = posts;

  const handleSearch = () => {
    setPage(0);
    setAppliedKeyword(keyword);
    setAppliedCategory(searchCategory);
  };

  const handleReset = () => {
    setKeyword("");
    setAppliedKeyword("");
    setSearchCategory("title");
    setAppliedCategory("title");
    setPage(0);
  };

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const currentBlock = Math.ceil((page + 1) / BLOCK_SIZE);
  const startPage = (currentBlock - 1) * BLOCK_SIZE;
  const endPage = Math.min(totalPages - 1, startPage + BLOCK_SIZE - 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        {boardType === "qna" && isAuthenticated && (
          <button
            onClick={() => navigate(`/instructor/${instrUuid}/qna/write`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            글쓰기
          </button>
        )}
      </div>

      {/* 검색 */}
      <div className="flex flex-col gap-2 sm:flex-row mb-6">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 cursor-pointer sm:w-28"
        >
          <option value="title">제목</option>
          <option value="writer">작성자</option>
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={searchCategory === "writer" ? "작성자를 입력하세요" : "제목을 입력하세요"}
          className="border border-gray-200 rounded-lg text-sm px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          검색
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          초기화
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">
          {appliedKeyword ? "검색 결과가 없습니다." : "게시글이 없습니다."}
        </p>
      ) : (
        <>
          <table className="w-full text-sm border-t-2 border-gray-800">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs whitespace-nowrap">
                <th className="py-3 px-4 text-center font-medium w-16 shrink-0">번호</th>
                <th className="py-3 px-4 text-left font-medium">제목</th>
                {boardType === "qna" && (
                  <th className="py-3 px-4 text-center font-medium w-24 shrink-0">답변</th>
                )}
                <th className="py-3 px-4 text-center font-medium w-28 shrink-0">작성자</th>
                <th className="py-3 px-4 text-center font-medium w-28 shrink-0">날짜</th>
                <th className="py-3 px-4 text-center font-medium w-16 shrink-0">조회</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post, idx) => (
                <tr
                  key={post.postSn}
                  onClick={() => navigate(`/instructor/${instrUuid}/${boardType}/${post.postSn}`)}
                  className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 text-center text-gray-400 text-xs shrink-0">
                    {totalCount - page * PAGE_SIZE - idx}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {boardType === "dataroom" && post.hasFile === "Y" && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded shrink-0">
                          파일
                        </span>
                      )}
                      {post.secrYn === "Y" && (
                        <span className="text-gray-400 shrink-0">🔒</span>
                      )}
                      <span
                        className="text-gray-800 line-clamp-1"
                        dangerouslySetInnerHTML={{ __html: processHtml(post.title) }}
                      />
                      {isNewPost(post.regDt) && (
                        <span className="text-[10px] font-bold text-blue-500 shrink-0">N</span>
                      )}
                    </div>
                  </td>
                  {boardType === "qna" && (
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-xs font-medium ${post.answerYn === "Y" ? "text-blue-500" : "text-gray-300"
                          }`}
                      >
                        {post.answerYn === "Y" ? "답변완료" : "미답변"}
                      </span>
                    </td>
                  )}
                  <td className="py-3.5 px-4 text-center text-gray-500 text-xs">{post.writerName}</td>
                  <td className="py-3.5 px-4 text-center text-gray-400 text-xs">{formatPostDate(post.regDt)}</td>
                  <td className="py-3.5 px-4 text-center text-gray-400 text-xs">{post.viewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <button
                onClick={() => handlePageChange(0)}
                disabled={page === 0}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default cursor-pointer text-sm transition-colors"
                title="첫 페이지"
              >
                «
              </button>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default cursor-pointer text-sm transition-colors"
                title="이전 페이지"
              >
                ‹
              </button>
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${page === p
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  {p + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages - 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default cursor-pointer text-sm transition-colors"
                title="다음 페이지"
              >
                ›
              </button>
              <button
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={page === totalPages - 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default cursor-pointer text-sm transition-colors"
                title="마지막 페이지"
              >
                »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
