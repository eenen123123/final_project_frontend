import { X, ChevronRight, BookOpen } from "lucide-react";
import type { CareerDto, BookDto } from "./types";
import { formatCareerYear } from "./utils";

export default function CareerBookModal({
  onClose,
  careers,
  books,
}: {
  onClose: () => void;
  careers: CareerDto[];
  books: BookDto[];
}) {
  const hasCareer = careers.length > 0;
  const hasBooks = books.length > 0;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-200 shadow-2xl w-[480px] max-h-[70vh] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">약력 / 저서</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
      <div className="overflow-y-auto px-5 py-4 space-y-6">
        {hasCareer && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              약력
            </h3>
            <div className="space-y-2.5">
              {careers.map((c, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <ChevronRight
                    size={14}
                    className="text-blue-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="text-gray-400 text-xs mr-2">
                      {formatCareerYear(c.careerStrtYr, c.careerEndYr)}
                    </span>
                    <span className="text-gray-800">{c.careerCont}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {hasBooks && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              저서
            </h3>
            <div className="space-y-2.5">
              {books.map((b, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <BookOpen
                    size={14}
                    className="text-orange-400 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{b.careerCont}</p>
                    <p className="text-xs text-gray-400">{b.careerStrtYr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
