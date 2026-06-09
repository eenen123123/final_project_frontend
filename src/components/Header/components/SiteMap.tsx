import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CurriculumTab from './CurriculumTab';
import api from '../../../api/api';

type SiteMapTab = '강사' | '커리큘럼' | '사이트맵';

interface InstructorInfo {
  instrUuid: string;
  userName: string;
  instrProfileImg: string;
}

type SubjectMap = Record<string, InstructorInfo[]>;

// ── 더미 데이터 ───────────────────────────────────────────────────────────
// const SUBJECTS = [
//   {
//     name: '국어',
//     groups: [
//       { label: null, items: ['박상호', '김국어', '이문학'] },
//       { label: '2022 개정', items: ['박상호', '김국어'] },
//       { label: '고1·2', items: ['민국어', '송문학'] },
//     ],
//   },
//   {
//     name: '수학',
//     groups: [
//       { label: null, items: ['이지은', '이도현', '정유진'] },
//       { label: '2022 개정', items: ['이지은', '정유진'] },
//       { label: '고1·2', items: ['주수학', '윤기하'] },
//     ],
//   },
//   {
//     name: '영어',
//     groups: [
//       { label: null, items: ['최영어', '박독해', '이어법'] },
//       { label: '2022 개정', items: ['최영어', '박독해'] },
//       { label: '고1·2', items: ['아이린', '장현명'] },
//     ],
//   },
//   {
//     name: '사회탐구',
//     groups: [
//       { label: '생활과 윤리/윤리와 사상', items: ['김윤리'] },
//       { label: '사회문화', items: ['임정환', '이형수'] },
//       { label: '동아시아사/세계사', items: ['권용기'] },
//       { label: '한국지리/세계지리', items: ['전성오'] },
//       { label: '정치와 법', items: ['최여름'] },
//       { label: '경제', items: ['민준호', '이형수'] },
//       { label: '2022 개정', items: [] },
//     ],
//   },
//   {
//     name: '과학탐구',
//     groups: [
//       { label: '물리학', items: ['방인혁', '홍진수'] },
//       { label: '화학', items: ['김준', '장성문'] },
//       { label: '생명과학', items: ['홍준용', '박선우'] },
//       { label: '지구과학', items: ['이훈식', '엄기은'] },
//       { label: '2022 개정', items: [] },
//       { label: '통합과학', items: ['정성태'] },
//     ],
//   },
//   {
//     name: '한국사',
//     groups: [
//       { label: null, items: ['권용기', '안현준', '연미정'] },
//       { label: '2022 개정', items: ['권용기', '안현준'] },
//     ],
//   },
//   {
//     name: '제2외국어',
//     groups: [
//       { label: '아랍어', items: ['지은경'] },
//       { label: '스페인어', items: ['신승'] },
//       { label: '중국어', items: ['리하이'] },
//       { label: '베트남어', items: ['이아영'] },
//       { label: '일본어', items: ['황신아'] },
//     ],
//   },
//   {
//     name: '대학별고사',
//     groups: [
//       { label: '인문논술', items: ['김용서'] },
//       { label: '수리논술', items: ['신재호', '유제승'] },
//       { label: '약술형 논술', items: ['신한종+고지우'] },
//       { label: '경찰대/사관학교', items: ['신한종', '이상인', '홍창우'] },
//       { label: '구술면접', items: ['유제승'] },
//     ],
//   },
// ];
// ──────────────────────────────────────────────────────────────────────────

const SITEMAP_LINKS = [
  {
    category: '강좌',
    items: ['국어', '수학', '영어', '사회탐구', '과학탐구', '한국사', '제2외국어', '대학별고사'],
  },
  {
    category: '고3·N수',
    items: ['시즌 특강', '영역별 기획전', '성적향상 NO.1 강좌', '베스트 수강후기'],
  },
  {
    category: '고2',
    items: ['시즌 특강', '영역별 기획전', '성적향상 NO.1 강좌', '베스트 수강후기', '강좌 7일 무료 체험'],
  },
  {
    category: '고1',
    items: ['시즌 특강', '영역별 기획전', '성적향상 NO.1 강좌', '2022 개정 가이드'],
  },
  {
    category: '대학별 고사',
    items: ['시즌 기획전', '대학별고사 기출문제', '대학별고사 공지사항'],
  },
  {
    category: '입시정보',
    items: ['2026 입시일정', '수능/학·모평 분석서비스', '성공입시전략', '최신입시뉴스', '대학정보 A to Z', '기출자료실'],
  },
  {
    category: '온라인 서점',
    items: ['온라인 서점 한 눈에 보기', '내신대비 교재'],
  },
  {
    category: '이벤트',
    items: ['진행중인 이벤트', '종료된 이벤트', '당첨자 발표'],
  },
  {
    category: '고객지원',
    items: ['마이페이지', '공지사항', 'Q&A', '자주 묻는 질문', '이용 약관'],
  },
];

interface SiteMapProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SiteMap({ isOpen, onClose }: SiteMapProps) {
  const [activeTab, setActiveTab] = useState<SiteMapTab>('강사');
  const [subjectMap, setSubjectMap] = useState<SubjectMap>({});
  const [loaded, setLoaded] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || loaded) return;
    api
      .get('http://localhost:8081/api/instructors/by-subject')
      .then((res) => { setSubjectMap(res.data); setLoaded(true); })
      .catch((err) => {
        console.error('강사 목록 조회 실패', err);
        setFetchError(err?.response?.status ? `${err.response.status} ${err.response.statusText}` : err.message);
        setLoaded(true);
      });
  }, [isOpen, loaded]);

  if (!isOpen) return null;

  const subjects = Object.entries(subjectMap);

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-5">

        {/* 탭 */}
        <div className="flex items-center gap-0 mb-6 border border-gray-200 rounded-lg w-fit overflow-hidden">
          {(['강사', '커리큘럼', '사이트맵'] as SiteMapTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 text-sm font-semibold transition-colors border-r border-gray-200 last:border-r-0 ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── 강사 탭 ── */}
        {activeTab === '강사' && (
          <div className="overflow-x-auto">
            {fetchError ? (
              <p className="text-sm text-red-400">강사 정보를 불러오지 못했습니다. ({fetchError})</p>
            ) : subjects.length === 0 ? (
              <p className="text-sm text-gray-400">강사 정보를 불러오는 중...</p>
            ) : (
              <div className="flex gap-0 min-w-max">
                {subjects.map(([subject, instructors], si) => (
                  <div
                    key={subject}
                    className={`flex-shrink-0 px-5 min-w-[120px] ${
                      si < subjects.length - 1 ? 'border-r border-gray-100' : ''
                    }`}
                  >
                    <p className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                      {subject}
                    </p>
                    <div className="space-y-1">
                      {instructors.map((instr) => (
                        <Link
                          key={instr.instrUuid}
                          to={`/instructor/${instr.instrUuid}`}
                          onClick={onClose}
                          className="block text-xs text-gray-600 hover:text-blue-600 transition-colors leading-relaxed"
                        >
                          {instr.userName}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 커리큘럼 탭 ── */}
        {activeTab === '커리큘럼' && <CurriculumTab />}

        {/* ── 사이트맵 탭 ── */}
        {activeTab === '사이트맵' && (
          <div className="grid grid-cols-5 gap-x-5 gap-y-5 max-w-4xl mx-auto">
            {SITEMAP_LINKS.map(({ category, items }) => (
              <div key={category}>
                <div className="pb-2 mb-3 border-b-2 border-gray-900 w-24">
                  <p className="text-base font-extrabold text-gray-900 tracking-tight">
                    {category}
                  </p>
                </div>
                <ul className="space-y-0.5">
                  {items.map((item) => (
                    <li key={item}>
                      <Link
                        to="/"
                        onClick={onClose}
                        className="text-[10px] text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
