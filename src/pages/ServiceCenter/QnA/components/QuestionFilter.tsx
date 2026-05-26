import type { AnswerStatus } from '../../../types/QnAInterface';

const STATUSES: AnswerStatus[] = ['전체', '답변 완료', '답변 대기'];

interface QuestionFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeStatus: AnswerStatus;
  onStatusChange: (status: AnswerStatus) => void;
}

export default function QuestionFilter({
  search,
  onSearchChange,
  activeStatus,
  onStatusChange,
}: QuestionFilterProps) {
  return (
    <div className="flex items-center gap-3">
      {/* 검색창 */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="질문 검색..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      {/* 상태 필터 탭 */}
      <div className="flex gap-1 flex-shrink-0">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeStatus === status
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
