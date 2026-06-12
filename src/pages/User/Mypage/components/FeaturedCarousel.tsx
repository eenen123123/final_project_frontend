import { useEffect, useState } from "react";
import api from "../../../../api/api";

interface FeaturedItem {
  featuredSn: number;
  prodType: "COURSE" | "TEXTBOOK";
  prodSn: number;
  customImg: string | null;
  customDesc: string | null;
  sortOrd: number;
  name: string;
  price: number;
  originImg: string | null;
  originDesc: string | null;
}

const VISIBLE = 3;

export default function FeaturedCarousel() {
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get<FeaturedItem[]>("/api/featured").then((res) => setItems(res.data));
  }, []);

  if (items.length === 0) return null;

  const maxIndex = Math.max(0, items.length - VISIBLE);
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">추천 강좌·교재</h3>
        <div className="flex gap-1">
          <button
            onClick={prev}
            disabled={index === 0}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            ‹
          </button>
          <button
            onClick={next}
            disabled={index === maxIndex}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{ transform: `translateX(calc(-${index} * (100% / ${VISIBLE} + 16px / ${VISIBLE})))` }}
        >
          {items.map((item) => {
            const img = item.customImg ?? item.originImg;
            const desc = item.customDesc ?? item.originDesc;
            const label = item.prodType === "COURSE" ? "강좌" : "교재";
            const labelClass =
              item.prodType === "COURSE"
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600";

            return (
              <div
                key={item.featuredSn}
                className="flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                style={{ width: `calc(100% / ${VISIBLE} - ${(VISIBLE - 1) * 16 / VISIBLE}px)` }}
              >
                <div className="w-full h-36 bg-gray-100 overflow-hidden">
                  {img ? (
                    <img src={img} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      이미지 없음
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${labelClass}`}>
                    {label}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-1.5 line-clamp-2 leading-snug">
                    {item.name}
                  </p>
                  {desc && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{desc}</p>
                  )}
                  <p className="text-sm font-bold text-blue-600 mt-2">
                    {item.price === 0 ? "무료" : `${item.price.toLocaleString()}원`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
