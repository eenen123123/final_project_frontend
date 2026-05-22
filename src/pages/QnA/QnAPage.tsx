import { useState, useMemo } from 'react';
import QuestionItem from './components/QuestionItem';
import QuestionFilter from './components/QuestionFilter';
import type { Question, AnswerStatus } from '../../types/QnAInterface';

// ── 더미 데이터 (추후 API 교체) ─────────────────────────────────────────────
const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1', index: 1, lectureIndex: 2,
    title: '기능론에서 "사회 통합"이 결과인지 전제인지 헷갈려요',
    preview: '기능론은 사회를 유기체에 비유한다고 배웠는데, 통합이 이미 있는 상태인지 추구해야 하는 목표인지 명확히 정리하고 싶습니다.',
    status: '답변 완료', author: '수험생A', date: '2026.05.07', answerCount: 2,
  },
  {
    id: 'q2', index: 2, lectureIndex: 2,
    title: '갈등론에서 "강제"의 정확한 의미가 궁금합니다',
    preview: '강제가 단순히 물리적 강제만 의미하는 건 아닐 텐데, 시험에서는 어떻게 구분해야 하나요?',
    status: '답변 완료', author: '준비생버', date: '2026.05.06', answerCount: 1,
  },
  {
    id: 'q3', index: 3, lectureIndex: 5,
    title: '참여 관찰과 실험의 자료 수집 방법 비교 요청',
    preview: '두 방법 모두 1차 자료를 얻는데, 양적/질적 연구와 결합되는 방식이 헷갈립니다.',
    status: '답변 대기', author: '북극성', date: '2026.05.05', answerCount: 0,
  },
  {
    id: 'q4', index: 4, lectureIndex: 13,
    title: '머튼의 적응 양식 5가지 표가 안 외워집니다 ㅠㅠ',
    preview: '동조/혁신/의례/도피/반역 — 매번 헷갈려요. 외우는 팁이 있을까요?',
    status: '답변 완료', author: '단풍잎', date: '2026.05.04', answerCount: 3,
  },
  {
    id: 'q5', index: 5, lectureIndex: 16,
    title: '문화 사대주의와 자문화 중심주의의 사례 추가 요청',
    preview: '교재 사례는 이해했는데, 비슷한 다른 사례를 더 보면 도움이 될 것 같습니다.',
    status: '답변 완료', author: '백두산', date: '2026.05.03', answerCount: 1,
  },
  {
    id: 'q6', index: 6, lectureIndex: 22,
    title: '기능론과 갈등론이 사회 계층화를 보는 시각 차이',
    preview: '기출 분석에서 자주 나오는데 본질적 차이를 다시 짚어주실 수 있을까요?',
    status: '답변 완료', author: '맞은하늘', date: '2026.04.30', answerCount: 2,
  },
];
// ──────────────────────────────────────────────────────────────────────────

export default function QnAPage() {
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState<AnswerStatus>('전체');

  const filtered = useMemo(() => {
    let result = [...MOCK_QUESTIONS];

    if (activeStatus !== '전체') {
      result = result.filter((q) => q.status === activeStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.preview.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, activeStatus]);

  const handleQuestionClick = (question: Question) => {
    // TODO: 질문 상세 페이지 라우팅
    console.log('질문 클릭:', question.id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 헤더 */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <p className="text-sm text-gray-400 mb-2">사회문화 A &nbsp;/&nbsp; QnA</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">질문과 답변</h1>
            <p className="text-sm text-gray-500">
              강의를 들으며 궁금한 점을 질문해보세요. 강사·조교가 24시간 이내 답변합니다.
            </p>
          </div>
          {/* 새 질문 버튼 */}
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex-shrink-0">
            <span className="text-base leading-none">+</span>
            새 질문
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div className="px-8 py-5 border-b border-gray-100">
        <QuestionFilter
          search={search}
          onSearchChange={setSearch}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </div>

      {/* 질문 목록 */}
      <div className="px-8">
        {filtered.length > 0 ? (
          filtered.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              onClick={handleQuestionClick}
            />
          ))
        ) : (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg mb-1">질문이 없어요</p>
            <p className="text-sm">다른 검색어나 필터를 선택해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
