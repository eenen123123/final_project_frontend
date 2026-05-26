import type { Question } from "../../../types/QnAInterface";

interface QuestionItemProps {
  question: Question;
  onClick?: (question: Question) => void;
}

export default function QuestionItem({ question, onClick }: QuestionItemProps) {
  const isDone = question.status === '답변 완료';

  return (
    <div
      onClick={() => onClick?.(question)}
      className="flex items-start gap-5 px-4 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {/* 번호 */}
      <span className="text-xs text-gray-300 w-10 flex-shrink-0 pt-0.5 font-mono">
        #{String(question.index).padStart(3, '0')}
      </span>

      {/* 강 뱃지 */}
      <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-1 flex-shrink-0 mt-0.5">
        {question.lectureIndex}강
      </span>

      {/* 본문 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 mb-1">{question.title}</p>
        <p className="text-xs text-gray-400 truncate">{question.preview}</p>
      </div>

      {/* 상태 뱃지 */}
      <div className="flex-shrink-0 mt-0.5">
        <span
          className={`text-xs font-medium px-2 py-1 rounded border ${
            isDone
              ? 'text-blue-600 border-blue-200 bg-blue-50'
              : 'text-amber-600 border-amber-200 bg-amber-50'
          }`}
        >
          {isDone ? '답변 완료' : '답변 대기'}
        </span>
      </div>

      {/* 메타 */}
      <div className="text-xs text-gray-400 flex-shrink-0 text-right leading-5 pt-0.5">
        <p>{question.author}</p>
        <p>{question.date}</p>
        <p>답변 {question.answerCount}</p>
      </div>
    </div>
  );
}
