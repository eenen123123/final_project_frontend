import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/api";

interface FeaturedItem {
  featuredSn: number;
  prodType: "COURSE" | "TEXTBOOK";
  prodSn: number;
  customImg: string | null;
  customDesc: string | null;
  sortOrd: number;
  name: string;
  originImg: string | null;
  originDesc: string | null;
  instrUuid: string | null;
}

const VISIBLE = 5;
const GAP = 12;
const AUTO_MS = 4000;

export default function FeaturedCarousel() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [index, setIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  useEffect(() => {
    api.get<FeaturedItem[]>("/api/featured").then((res) => setItems(res.data));
  }, []);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setItemWidth(Math.round((w - (VISIBLE - 1) * GAP) / VISIBLE));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= VISIBLE) return;
    const id = setInterval(() => {
      if (!hoverRef.current) {
        setIndex((i) => {
          const max = items.length - VISIBLE;
          return i >= max ? 0 : i + 1;
        });
      }
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const maxIndex = Math.max(0, items.length - VISIBLE);

  const handleClick = (item: FeaturedItem) => {
    if (item.prodType === "COURSE" && item.instrUuid) {
      navigate(`/instructor/${item.instrUuid}/courses/${item.prodSn}`);
    } else if (item.prodType === "TEXTBOOK") {
      navigate(`/header/books/${item.prodSn}`);
    }
  };

  return (
    <div
      className="border border-gray-200 rounded-xl p-5 mb-5"
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">추천 강좌·교재</h3>
          <p className="text-xs text-gray-400 mt-0.5">지금 시작하기 좋은 강좌와 교재를 만나보세요</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors text-base"
          >‹</button>
          <button
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={index === maxIndex}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors text-base"
          >›</button>
        </div>
      </div>

      {/* 슬라이더 */}
      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            gap: `${GAP}px`,
            transform: `translate3d(-${index * (itemWidth + GAP)}px, 0, 0)`,
          }}
        >
          {items.map((item) => {
            const img = item.customImg ?? item.originImg;
            const desc = item.customDesc ?? item.originDesc;
            const isCourse = item.prodType === "COURSE";

            return (
              <div
                key={item.featuredSn}
                className="flex-shrink-0 flex flex-col"
                style={{ width: `${itemWidth}px` }}
              >
                {/* 카드 */}
                <div
                  onClick={() => handleClick(item)}
                  className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-100 hover:shadow-md transition-shadow cursor-pointer aspect-[3/4]"
                >
                  {img ? (
                    <img
                      src={img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                      이미지 없음
                    </div>
                  )}

                  {(desc ?? item.name) && (
                    <p
                      className="absolute top-2 left-0 right-0 text-center text-xs font-semibold text-white px-2 truncate"
                      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
                    >
                      {desc ?? item.name}
                    </p>
                  )}
                </div>

                {/* 카드 하단 버튼 */}
                <button
                  onClick={() => handleClick(item)}
                  className="mt-2 w-full py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {isCourse ? "신청하기" : "구매하기"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 인디케이터 */}
      {items.length > VISIBLE && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-200 ${
                i === index ? "w-4 h-1.5 bg-blue-500" : "w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
