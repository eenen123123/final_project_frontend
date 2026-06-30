import { useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard } from "lucide-react";
import api from "../../../api/api";

export interface TextbookDto {
  textbookSn: number;
  textbookNm: string;
  pubrNm: string;
  authrNm: string;
  isbnNo: string;
  trgtGrdCn: string;
  subjClNm: string;
  subjNm: string;
  salePrcAmt: number;
  dlvrAmt: number;
  thmbImg: string | null;
  tagline: string | null;
  bookSmry: string | null;
  tocCn: string | null;
  instrUserNm: string | null;
  instrUuid: string | null;
  instrProfileImg: string | null;
  courseNm: string | null;
  courseSn: number | null;
  salableCnt: number | null;
  regDt: string;
}

export default function BookCard({ book }: { book: TextbookDto }) {
  const navigate = useNavigate();
  const inStock = book.salableCnt == null || book.salableCnt > 0;
  const goDetail = () => navigate(`/header/books/${book.textbookSn}`);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.post("/api/cart", {
        prodDivCd: "TEXTBOOK",
        prodSn: book.textbookSn,
        prodNm: book.textbookNm,
        prodPrice: book.salePrcAmt,
        itemQty: 1,
      });
      // 201 Created — 새로 담김
      const go = window.confirm(
        `${res.data}\n마이페이지(장바구니)에서 확인하시겠습니까?`,
      );
      if (go) navigate("/mycart");
    } catch (err) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosErr.response?.status;
      const message = axiosErr.response?.data?.message;
      if (status === 409) {
        // 409 Conflict — 이미 담긴 상품 (CART_ITEM_ALREADY_EXISTS)
        const go = window.confirm(
          `${message}\n마이페이지(장바구니)에서 확인하시겠습니까?`,
        );
        if (go) navigate("/mycart");
      } else if (status === 401) {
        alert("로그인이 필요합니다.");
      } else {
        alert(message ?? "오류가 발생했습니다.");
      }
    }
  };

  return (
    <div
      onClick={goDetail}
      className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all border border-gray-100 hover:shadow-md hover:border-gray-200 cursor-pointer"
    >
      <div className="p-4 sm:p-5 sm:flex sm:gap-6 sm:items-start">
        {/* 북 커버 (모바일: float로 띄워 본문이 아래까지 감싸도록) */}
        <div className="float-left mr-4 mb-2 sm:float-none sm:mr-0 sm:mb-0 sm:shrink-0">
          {book.thmbImg ? (
            <img
              src={book.thmbImg}
              alt={book.textbookNm}
              className="w-24 h-32 sm:w-36 sm:h-48 object-cover rounded-r-xl shadow-md"
            />
          ) : (
            <div className="w-24 h-32 sm:w-36 sm:h-48 bg-blue-900 rounded-r-xl shadow-md p-3 flex flex-col justify-between text-white border-l-4 border-black/20">
              <div className="space-y-1">
                <span className="text-[12px] bg-white/20 px-1.5 py-0.5 rounded font-bold tracking-widest uppercase">
                  HERMES
                </span>
                <h5 className="text-[13px] font-bold leading-tight tracking-tight line-clamp-2 mt-2">
                  {book.subjNm}
                </h5>
                <h5 className="text-[13px] font-bold leading-tight tracking-tight line-clamp-3 mt-1">
                  {book.textbookNm}
                </h5>
              </div>
              <span className="text-[12px] font-medium tracking-tight text-right block opacity-80">
                {book.authrNm} 저
              </span>
            </div>
          )}
        </div>

        {/* 본문 */}
        <div className="sm:flex-1 sm:min-w-0 sm:flex sm:flex-col sm:gap-2">
          <div className="space-y-1">
            {/* 과목 배지 + 재고 상태 */}
            <div className="flex items-center gap-2 flex-wrap">
              {book.subjClNm && (
                <span className="text-xs font-bold text-blue-600">
                  {book.subjClNm}
                </span>
              )}
              {book.subjNm && (
                <>
                  <span className="text-gray-300 text-xs">›</span>
                  <span className="text-xs text-gray-500 font-medium">
                    {book.subjNm}
                  </span>
                </>
              )}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${
                  inStock
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-100 text-gray-400 border-gray-200"
                }`}
              >
                {inStock ? "입고완료" : "품절"}
              </span>
            </div>

            {/* 교재명 */}
            <h3 className="text-base sm:text-2xl font-bold text-gray-900 leading-snug">
              {book.textbookNm}
            </h3>

            {/* 간략 요약 */}
            {book.bookSmry && (
              <ul className="space-y-0.5 pt-0.5">
                {book.bookSmry
                  .split("\n")
                  .filter((l) => l.trim())
                  .slice(0, 2)
                  .map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1 text-xs sm:text-sm text-gray-500 leading-relaxed"
                    >
                      <span className="text-gray-400 flex-shrink-0">·</span>
                      {line.trim()}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* 하단 메타 + 버튼 */}
          <div className="clear-left sm:clear-none flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pt-2 sm:pt-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              {book.courseNm && (
                <span>
                  <span className="font-semibold text-gray-600">연결 강좌</span>{" "}
                  {book.courseNm}
                  {book.instrUserNm && (
                    <span className="text-gray-400">
                      {" "}
                      · {book.instrUserNm} 선생님
                    </span>
                  )}
                </span>
              )}
              {book.pubrNm && (
                <span>
                  <span className="font-semibold text-gray-600">출판사</span>{" "}
                  {book.pubrNm}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1.5 shrink-0">
              <span className="text-lg sm:text-xl font-black text-gray-900">
                {book.salePrcAmt.toLocaleString()}원
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="장바구니"
                >
                  <ShoppingCart size={15} />
                </button>
                {/* <button
                  onClick={(e) => { e.stopPropagation(); }}
                  disabled={!inStock}
                  className="w-8 h-8 flex items-center justify-center bg-gray-900 rounded-lg text-white hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="바로 구매"
                >
                  <CreditCard size={15} />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
