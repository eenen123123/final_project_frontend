import type { CourseDetail, SidebarTab } from '../../../types/OnlineLectureInterface';

interface CourseSidebarProps {
  course: CourseDetail;
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

const TABS: SidebarTab[] = ['강의 목록', '공지사항', 'QnA', '교안', '교재'];

export default function CourseSidebar({ course, activeTab, onTabChange }: CourseSidebarProps) {
  return (
    <aside className="w-72 flex-shrink-0 border border-gray-200 rounded-xl p-6 self-start">
      {/* 강좌명 뱃지 */}
      <div className="inline-block bg-gray-900 text-white text-sm font-semibold px-3 py-1.5 rounded-md mb-7">
        {course.title}
      </div>

      {/* 진척도 */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-gray-500">진척도</span>
          <span className="text-2xl font-bold text-gray-900 leading-none">
            {course.progress}
            <span className="text-sm font-normal text-gray-500 ml-0.5">%</span>
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">
            {course.completedLectures}/{course.totalLectures} 완강
          </span>
          <span className="text-xs text-gray-400">
            최근 학습 {course.lastStudied}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* 탭 메뉴 */}
      <nav className="mt-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`w-full flex justify-between items-center px-2 py-3.5 text-sm transition-colors rounded-md ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 font-normal'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-xs ${isActive ? 'text-blue-400' : 'text-gray-300'}`}>
                {String(course.tabCounts[tab]).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
