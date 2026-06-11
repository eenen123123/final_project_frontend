import { useNavigate } from "react-router-dom";

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

  return (
    <div onClick={goDetail} className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all border border-gray-100 hover:shadow-md hover:border-gray-200 cursor-pointer">
      <div className="flex flex-col md:flex-row gap-8 p-8 items-start md:items-stretch">

        {/* 북 커버 */}
        <div className="flex-shrink-0 flex justify-center md:justify-start">
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
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
          <div className="space-y-1.5">
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

            {/* 태그라인 */}
            {book.tagline && (
              <p className="text-[11px] text-blue-500 font-medium">
                {book.tagline}
              </p>
            )}

            {/* 교재명 */}
            <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug">
              {book.textbookNm}
            </h3>

            {/* 저자 */}
            <p className="text-xs text-gray-400 font-medium">
              {book.authrNm} 저
            </p>

            {/* 간략 요약 */}
            {book.bookSmry && (
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 pt-0.5">
                {book.bookSmry}
              </p>
            )}

            {/* 대상 학년 */}
            {book.trgtGrdCn && (
              <ul className="space-y-0.5 pt-1">
                {book.trgtGrdCn.split("\n").map((line, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-gray-500 leading-relaxed"
                  >
                    <span className="text-blue-400 flex-shrink-0 mt-0.5">·</span>
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 하단 메타 정보 */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-3 border-t border-gray-100 text-xs text-gray-500">
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
            {book.salableCnt != null && (
              <span>
                <span className="font-semibold text-gray-600">재고</span>{" "}
                {book.salableCnt}권
              </span>
            )}
          </div>
        </div>

        {/* 결제 패널 */}
        <div className="w-full md:w-52 flex flex-col justify-between items-end shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <div className="text-right w-full mb-4">
            <span className="text-xs text-gray-400 font-medium block mb-0.5">
              도서 판매가
            </span>
            <strong className="text-2xl font-black text-gray-900 tracking-tight">
              {book.salePrcAmt.toLocaleString()}원
            </strong>
            {book.dlvrAmt > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                배송비 {book.dlvrAmt.toLocaleString()}원
              </p>
            )}
          </div>
          <div className="flex gap-2 w-full">
            <button
              disabled={!inStock}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              장바구니
            </button>
            <button
              disabled={!inStock}
              className="flex-1 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer whitespace-nowrap shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
