import type { Teacher } from '../../../types/OnlineLectureInterface';

interface TeacherCardProps {
  teacher: Teacher;
  totalLectures: number;
  totalHours: number;
  startDate: string;
}

export default function TeacherCard({ teacher, totalLectures, totalHours, startDate }: TeacherCardProps) {
  return (
    <div className="flex gap-6 pb-8 border-b border-gray-100">
      {/* 강사 사진 */}
      <div className="w-36 h-36 flex-shrink-0 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
        {teacher.photoUrl ? (
          <img
            src={teacher.photoUrl}
            alt={teacher.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-xs text-gray-400">강사 사진</span>
        )}
      </div>

      {/* 강사 정보 */}
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-1">{teacher.subject}</p>
        <div className="flex items-baseline gap-1.5 mb-1">
          <h2 className="text-2xl font-bold text-gray-900">{teacher.name}</h2>
          <span className="text-sm text-gray-500">선생님</span>
        </div>
        <p className="text-sm text-gray-500 mb-3">{teacher.role}</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{teacher.bio}</p>

        {/* 수강 통계 */}
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">총 강의</p>
            <p className="text-xl font-bold text-gray-900">
              {totalLectures}
              <span className="text-sm font-normal text-gray-500 ml-0.5">강</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">총 학습 시간</p>
            <p className="text-xl font-bold text-gray-900">
              {totalHours}
              <span className="text-sm font-normal text-gray-500 ml-0.5">h</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">수강 시작</p>
            <p className="text-xl font-bold text-gray-900">{startDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
