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

const GAP = 12;
const AUTO_MS = 4000;

// 화면 폭에 따라 한 번에 보여줄 카드 수
function visibleForWidth(w: number) {
  if (w < 480) return 2;
  if (w < 768) return 3;
  return 5;
}

export default function FeaturedCarousel() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [index, setIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [visible, setVisible] = useState(5);

  useEffect(() => {
    api.get<FeaturedItem[]>("/api/featured").then((res) => setItems(res.data));
  }, []);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const v = visibleForWidth(w);
        setVisible(v);
        setItemWidth(Math.round((w - (v - 1) * GAP) / v));
        setIndex((i) => Math.min(i, Math.max(0, items.length - v)));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= visible) return;
    const id = setInterval(() => {
      if (!hoverRef.current) {
        setIndex((i) => {
          const max = items.length - visible;
          return i >= max ? 0 : i + 1;
        });
      }
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [items.length, visible]);

  if (items.length === 0) return null;

  const maxIndex = Math.max(0, items.length - visible);

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
                {isCourse ? (
                  <div
                    onClick={() => handleClick(item)}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100 hover:shadow-md transition-shadow cursor-pointer aspect-[3/4] flex flex-col"
                  >
                    {desc && (
                      <div className="px-3 pt-2 pb-1 text-center">
                        <p className="text-[10px] text-gray-600 underline truncate">{desc}</p>
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      {img ? (
                        <img src={img} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                          이미지 없음
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleClick(item)}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer aspect-[3/4] flex flex-col"
                  >
                    {desc && (
                      <div className="px-3 pt-2 pb-1 text-center">
                        <p className="text-[10px] text-gray-500 underline truncate">{desc}</p>
                      </div>
                    )}
                    <div className="flex-1 flex items-center justify-center px-5 pb-3">
                      {img ? (
                        <img src={img} alt={item.name} className="max-h-full object-contain drop-shadow-md" />
                      ) : (
                        <div className="text-gray-300 text-[10px]">이미지 없음</div>
                      )}
                    </div>
                  </div>
                )}

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
      {items.length > visible && (
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
