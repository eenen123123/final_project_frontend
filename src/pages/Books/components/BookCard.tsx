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
        prodDivCd: "10",
        prodSn: book.textbookSn,
        prodNm: book.textbookNm,
        prodPrice: book.salePrcAmt,
        itemQty: 1,
      });
      if (res.data === "이미 장바구니에 담긴 상품입니다.") {
        const go = window.confirm("이미 장바구니에 담긴 상품입니다.\n마이페이지(장바구니)에서 확인하시겠습니까?");
        if (go) navigate("/mycart");
      } else {
        const go = window.confirm("장바구니에 담으셨습니다.\n마이페이지(장바구니)에서 확인하시겠습니까?");
        if (go) navigate("/mycart");
      }
    } catch {
      alert("로그인이 필요합니다.");
    }
  };

  return (
    <div onClick={goDetail} className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all border border-gray-100 hover:shadow-md hover:border-gray-200 cursor-pointer">
      <div className="flex gap-6 p-5 items-start">

        {/* 북 커버 */}
        <div className="flex-shrink-0">
          {book.thmbImg ? (
            <img
              src={book.thmbImg}
              alt={book.textbookNm}
              className="w-36 h-48 object-cover rounded-r-xl shadow-md"
            />
          ) : (
            <div className="w-36 h-48 bg-blue-900 rounded-r-xl shadow-md p-3 flex flex-col justify-between text-white border-l-4 border-black/20">
              <div className="space-y-1">
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold tracking-widest uppercase">
                  HERMES
                </span>
                <h5 className="text-[11px] font-bold leading-tight tracking-tight line-clamp-3 mt-1">
                  {book.textbookNm}
                </h5>
              </div>
              <span className="text-[10px] font-medium tracking-tight text-right block opacity-80">
                {book.authrNm} 저
              </span>
            </div>
          )}
        </div>

        {/* 본문 */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
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
            <h3 className="text-2xl font-bold text-gray-900 leading-snug">
              {book.textbookNm}
            </h3>

            {/* 간략 요약 */}
            {book.bookSmry && (
              <ul className="space-y-0.5 pt-0.5">
                {book.bookSmry.split("\n").filter(l => l.trim()).slice(0, 2).map((line, i) => (
                  <li key={i} className="flex items-start gap-1 text-sm text-gray-500 leading-relaxed">
                    <span className="text-gray-400 flex-shrink-0">·</span>
                    {line.trim()}
                  </li>
                ))}
              </ul>
            )}

          </div>

          {/* 하단 메타 + 버튼 */}
          <div className="flex items-end justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              {book.courseNm && (
                <span>
                  <span className="font-semibold text-gray-600">연결 강좌</span>{" "}
                  {book.courseNm}
                  {book.instrUserNm && (
                    <span className="text-gray-400"> · {book.instrUserNm} 선생님</span>
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
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-xl font-black text-gray-900">
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
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  disabled={!inStock}
                  className="w-8 h-8 flex items-center justify-center bg-gray-900 rounded-lg text-white hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="바로 구매"
                >
                  <CreditCard size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
