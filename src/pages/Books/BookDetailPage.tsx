import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Home } from "lucide-react";
import api from "../../api/api";
import { type TextbookDto } from "./components/BookCard";

const NOW = Date.now();

type TabKey = "intro" | "toc" | "info";

const TABS: { key: TabKey; label: string }[] = [
  { key: "intro", label: "교재 소개" },
  { key: "toc", label: "목차" },
  { key: "info", label: "상세 정보" },
];

function TabSection({ book }: { book: TextbookDto }) {
  const [active, setActive] = useState<TabKey>("intro");

  return (
    <div>
      {/* 탭 헤더 */}
      <div className="flex mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-10 py-3 text-sm border border-gray-200 transition-colors cursor-pointer -ml-px first:ml-0 ${
              active === tab.key
                ? "font-bold text-gray-900 border-b-white bg-white relative z-10"
                : "text-gray-400 bg-gray-50 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1 border-b border-gray-200" />
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-3xl">
        {active === "intro" &&
          (book.trgtGrdCn ? (
            <div className="text-sm text-gray-700 leading-loose whitespace-pre-line">
              {book.trgtGrdCn}
            </div>
          ) : (
            <p className="text-sm text-gray-400">교재 소개가 없습니다.</p>
          ))}

        {active === "toc" &&
          (book.tocCn ? (
            <div className="text-sm text-gray-700 leading-loose whitespace-pre-line">
              {book.tocCn}
            </div>
          ) : (
            <p className="text-sm text-gray-400">목차 정보가 없습니다.</p>
          ))}

        {active === "info" && (
          <table className="text-sm w-full max-w-sm">
            <tbody>
              {book.pubrNm && (
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-8 text-gray-400 w-24">출판사</td>
                  <td className="py-2.5 text-gray-800">{book.pubrNm}</td>
                </tr>
              )}
              {book.authrNm && (
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-8 text-gray-400">저자</td>
                  <td className="py-2.5 text-gray-800">{book.authrNm}</td>
                </tr>
              )}
              {book.isbnNo && (
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-8 text-gray-400">ISBN</td>
                  <td className="py-2.5 text-gray-800">{book.isbnNo}</td>
                </tr>
              )}
              {book.subjClNm && (
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-8 text-gray-400">과목</td>
                  <td className="py-2.5 text-gray-800">
                    {book.subjClNm}
                    {book.subjNm && ` › ${book.subjNm}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function BookDetailPage() {
  const { textbookSn } = useParams<{ textbookSn: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<TextbookDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [courseOpen, setCourseOpen] = useState(true);

  useEffect(() => {
    if (!textbookSn) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/textbook/${textbookSn}`);
        setBook(res.data);
      } catch {
        navigate("/header/books");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [textbookSn, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <p className="text-sm text-gray-400">교재 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!book) return null;

  const inStock = book.salableCnt == null || book.salableCnt > 0;
  const total = book.salePrcAmt + (book.dlvrAmt ?? 0);
  const isNew = !!book.regDt && NOW - new Date(book.regDt).getTime() < 30 * 24 * 60 * 60 * 1000;

  const handleAddToCart = async () => {
    try {
      const res = await api.post("/api/cart", {
        prodDivCd: "TEXTBOOK",
        prodSn: book.textbookSn,
        prodNm: book.textbookNm,
        prodPrice: book.salePrcAmt,
        itemQty: 1,
      });
      // 201 Created — 새로 담김
      const go = window.confirm(`${res.data}\n마이페이지(장바구니)에서 확인하시겠습니까?`);
      if (go) navigate("/mycart");
    } catch (err) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosErr.response?.status;
      const message = axiosErr.response?.data?.message;
      if (status === 409) {
        // 409 Conflict — 이미 담긴 상품 (CART_ITEM_ALREADY_EXISTS)
        const go = window.confirm(`${message}\n마이페이지(장바구니)에서 확인하시겠습니까?`);
        if (go) navigate("/mycart");
      } else if (status === 401) {
        alert("로그인이 필요합니다.");
      } else {
        alert(message ?? "오류가 발생했습니다.");
      }
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-10">
        {/* 상단 타이틀 영역 */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {isNew && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded border bg-blue-600 text-white border-blue-600">
                NEW
              </span>
            )}
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                inStock
                  ? "bg-white text-emerald-600 border-emerald-400"
                  : "bg-white text-gray-400 border-gray-300"
              }`}
            >
              {inStock ? "판매중" : "품절"}
            </span>
            {book.subjClNm && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded border bg-white text-blue-500 border-blue-300">
                {book.subjClNm}
                {book.subjNm && ` · ${book.subjNm}`}
              </span>
            )}
          </div>

          {book.tagline && (
            <p className="text-sm font-semibold text-blue-600 mb-1">
              {book.tagline}
            </p>
          )}
          <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-snug">
            {book.textbookNm}
          </h1>
        </div>

        <hr className="border-gray-200 mb-10" />

        {/* 메인 2컬럼 */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-14 mb-12">
          {/* 왼쪽: 표지 */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            {book.thmbImg ? (
              <img
                src={book.thmbImg}
                alt={book.textbookNm}
                className="w-64 object-cover rounded-r-xl shadow-lg"
              />
            ) : (
              <div className="w-64 h-80 bg-blue-900 rounded-r-xl shadow-lg p-4 flex flex-col justify-between text-white border-l-4 border-black/20">
                <div className="space-y-1.5">
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold tracking-widest uppercase">
                    HERMES
                  </span>
                  <h4 className="text-sm font-bold leading-tight mt-1">
                    {book.textbookNm}
                  </h4>
                </div>
                <span className="text-[11px] font-medium text-right opacity-80">
                  {book.authrNm} 저
                </span>
              </div>
            )}
            <button className="w-64 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
              미리보기
            </button>
          </div>

          {/* 오른쪽: 정보 */}
          <div className="flex-1 min-w-0">
            {/* 강사 + 가격 정보 한 블록 */}
            <div className="flex items-start gap-5 mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 shrink-0 overflow-hidden">
                {book.instrProfileImg ? (
                  <img
                    src={book.instrProfileImg}
                    alt={book.instrUserNm ?? ""}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-400">
                      {book.instrUserNm?.[0] ?? "?"}
                    </span>
                  </div>
                )}
              </div>

              <table className="flex-1 text-xs">
                <tbody>
                  <tr>
                    <td className="text-gray-400 py-0.5 pr-5 w-10 align-middle whitespace-nowrap">
                      {book.subjClNm ?? ""}
                    </td>
                    <td className="py-0.5 align-middle">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 text-sm">
                          {book.instrUserNm ?? book.authrNm} 선생님
                        </span>
                        {book.instrUuid && (
                          <button
                            onClick={() =>
                              navigate(`/instructor/${book.instrUuid}`)
                            }
                            className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                            title="강사 홈"
                          >
                            <Home size={11} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 py-0.5 pr-5 whitespace-nowrap">
                      판매가
                    </td>
                    <td className="font-black text-gray-900 py-0.5 text-base">
                      {book.salePrcAmt.toLocaleString()}원
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 py-0.5 pr-5 whitespace-nowrap">
                      배송비
                    </td>
                    <td className="text-gray-700 py-0.5">
                      {(book.dlvrAmt ?? 0) > 0
                        ? `${book.dlvrAmt.toLocaleString()}원`
                        : "무료배송"}
                    </td>
                  </tr>
                  {book.isbnNo && (
                    <tr>
                      <td className="text-gray-400 py-0.5 pr-5 whitespace-nowrap">
                        ISBN
                      </td>
                      <td className="text-gray-700 py-0.5">{book.isbnNo}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 요약 설명 */}
            {book.bookSmry && (
              <>
                <hr className="border-gray-200 mb-5" />
                <div className="mb-6 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {book.bookSmry}
                </div>
              </>
            )}

            {/* 주문 금액 계산 */}
            <div className="border border-gray-200 rounded overflow-hidden mb-3">
              <div className="flex items-center text-center text-sm">
                <div className="flex-1 py-4 px-3">
                  <p className="text-gray-500 text-xs mb-1">주문 금액</p>
                  <p className="font-bold text-gray-800">
                    {book.salePrcAmt.toLocaleString()} 원
                  </p>
                </div>
                <span className="text-gray-300 text-lg font-light">+</span>
                <div className="flex-1 py-4 px-3">
                  <p className="text-gray-500 text-xs mb-1">배송비</p>
                  <p className="font-bold text-gray-800">
                    {(book.dlvrAmt ?? 0).toLocaleString()} 원
                  </p>
                </div>
                <span className="text-gray-300 text-lg font-light">=</span>
                <div className="flex-1 py-4 px-3 bg-gray-50">
                  <p className="text-gray-500 text-xs mb-1">합계</p>
                  <p className="font-black text-red-500 text-base">
                    {total.toLocaleString()} 원
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              · 합계 금액은 실 결제단계에서 상품 특성 및 할인권 적용 등에 따라
              차이가 발생할 수 있습니다.
              <br />· 장바구니에 담긴 상품은 보관기한이 만료되기 전 관리자에
              의해 품절 처리될 수 있습니다.
            </p>

            {/* 구매 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 py-3.5 border border-gray-300 rounded font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                장바구니
              </button>
              <button
                disabled={!inStock}
                className="flex-1 py-3.5 bg-gray-900 text-white rounded font-semibold text-sm hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                바로 구매
              </button>
            </div>
          </div>
        </div>

        {/* 연결된 강좌 섹션 */}
        {book.courseNm && (
          <div className="border border-gray-200 rounded-lg mb-8 overflow-hidden">
            <button
              onClick={() => setCourseOpen((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              이 교재와 연결된 강좌
              {courseOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {courseOpen && (
              <div className="border-t border-gray-100">
                <div
                  onClick={() => navigate(`/courses/${book.courseSn}`)}
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                    {book.courseNm}
                  </span>
                  {book.instrUserNm && (
                    <span className="text-xs text-gray-400 ml-auto">
                      {book.instrUserNm} 선생님
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 탭 */}
        <TabSection book={book} />
      </div>
    </div>
  );
}
