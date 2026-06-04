import type { Lecture } from '../../../types/OnlineLectureInterface';

interface LectureListProps {
  lectures: Lecture[];
  totalLectures: number;
  totalHours: number;
}

export default function LectureList({ lectures, totalLectures, totalHours }: LectureListProps) {
  return (
    <div>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-900">강의 목록</h3>
        <span className="text-sm text-gray-400">
          {totalLectures}강 · 총 {totalHours}시간
        </span>
      </div>

      {/* 컬럼 헤더 */}
      <div className="grid grid-cols-[60px_1fr_80px_100px] text-xs text-gray-400 px-4 pb-2 border-b border-gray-100">
        <span></span>
        <span>강의</span>
        <span className="text-center">분량</span>
        <span className="text-center">진도</span>
      </div>

      {/* 강의 목록 */}
      <div className="divide-y divide-gray-50">
        {lectures.map((lecture) => {
          const isInProgress = lecture.progress > 0 && lecture.progress < 100;
          const isDone = lecture.progress === 100;

          return (
            <div
              key={lecture.id}
              className={`grid grid-cols-[60px_1fr_80px_100px] items-center px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${
                isInProgress ? 'bg-blue-50/40' : ''
              }`}
            >
              {/* 강 번호 */}
              <div className="flex items-center gap-1.5">
                {lecture.index === 0 ? (
                  <span className="text-xs font-semibold text-gray-500">OT</span>
                ) : (
                  <span className={`text-sm font-semibold ${isInProgress ? 'text-blue-600' : 'text-gray-400'}`}>
                    {lecture.index}강
                  </span>
                )}
                <span className="text-xs text-gray-300">{lecture.subIndex}</span>
              </div>

              {/* 제목 */}
              <div>
                <p className={`text-sm ${isInProgress ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                  {lecture.title}
                </p>
                {lecture.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{lecture.description}</p>
                )}
              </div>

              {/* 분량 */}
              <span className="text-xs text-gray-400 text-center">{lecture.duration}분</span>

              {/* 진도 */}
              <div className="flex items-center justify-center gap-2">
                {lecture.progress > 0 && (
                  <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isDone ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${lecture.progress}%` }}
                    />
                  </div>
                )}
                {isDone && (
                  <span className="text-xs font-semibold text-green-500">100%</span>
                )}
                {isInProgress && (
                  <span className="text-xs font-semibold text-blue-500">{lecture.progress}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
