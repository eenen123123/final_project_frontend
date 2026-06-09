import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/api";
import { formatPostDate, isNewPost } from "../InstructorDetail/utils";

interface BoardPost {
  postSn: number;
  title: string;
  regDt: string;
  viewCount: number;
  writerNickname: string;
  answerYn: "Y" | "N" | null;
  hasFile: "Y" | "N";
}

interface BoardResponse {
  items: BoardPost[];
  totalCount: number;
}

interface Props {
  boardType: "notice" | "qna" | "material";
  title: string;
}

const PAGE_SIZE = 10;

export default function BoardTab({ boardType, title }: Props) {
  const { instrUuid } = useParams<{ instrUuid: string }>();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!instrUuid) return;
    let cancelled = false;
    api
      .get<BoardResponse>(
        `/api/instructors/${instrUuid}/board/${boardType}?page=${page}&size=${PAGE_SIZE}`
      )
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
  }, [instrUuid, boardType, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-6">
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-400">{totalCount}개</span>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-gray-400">게시글이 없습니다.</p>
      ) : (
        <>
          <table className="w-full text-sm border-t border-gray-200">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-xs">
                <th className="py-2.5 text-left font-medium w-full pl-1">제목</th>
                {boardType === "qna" && (
                  <th className="py-2.5 text-center font-medium w-16 shrink-0">답변</th>
                )}
                <th className="py-2.5 text-center font-medium w-24 shrink-0">작성자</th>
                <th className="py-2.5 text-center font-medium w-24 shrink-0">날짜</th>
                <th className="py-2.5 text-center font-medium w-14 shrink-0">조회</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.postSn}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 pl-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      {boardType === "material" && post.hasFile === "Y" && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded shrink-0">
                          파일
                        </span>
                      )}
                      <span className="text-gray-800 line-clamp-1">{post.title}</span>
                      {isNewPost(post.regDt) && (
                        <span className="text-[10px] font-bold text-blue-500 shrink-0">N</span>
                      )}
                    </div>
                  </td>
                  {boardType === "qna" && (
                    <td className="py-3 text-center">
                      <span
                        className={`text-xs font-medium ${
                          post.answerYn === "Y" ? "text-blue-500" : "text-gray-300"
                        }`}
                      >
                        {post.answerYn === "Y" ? "답변완료" : "미답변"}
                      </span>
                    </td>
                  )}
                  <td className="py-3 text-center text-gray-500 text-xs">
                    {post.writerNickname}
                  </td>
                  <td className="py-3 text-center text-gray-400 text-xs">
                    {formatPostDate(post.regDt)}
                  </td>
                  <td className="py-3 text-center text-gray-400 text-xs">{post.viewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-6">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 text-xs rounded transition-colors ${
                    page === i
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
