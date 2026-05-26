import { useState, useMemo } from 'react';
import NoticeItem from './components/NoticeItem';
import type { Notice } from '../../types/NoticeInterface';

// ── 더미 데이터 (추후 API 교체) ─────────────────────────────────────────────
const MOCK_NOTICES: Notice[] = [
  {
    id: 'n1',
    category: '공지',
    title: '5월 모의고사 해설 라이브 안내 (5/18 20:00)',
    preview: '5월 학평 사회문화 전 문항 라이브 해설을 진행합니다. 라이브 중 채팅으로 질문하면 실시간 답변드립니다.',
    date: '2026.05.07',
    isPinned: true,
  },
  {
    id: 'n2',
    category: '업데이트',
    title: '13~14강 (일탈 이론) 자료 v2 업로드',
    preview: '머튼의 적응 양식 표를 보강하여 PDF를 다시 올렸습니다. 마이페이지 > 자료실에서 확인해주세요.',
    date: '2026.05.05',
    isPinned: true,
  },
  {
    id: 'n3',
    category: '공지',
    title: '수강 기간 연장 정책 변경 안내',
    preview: '기존 1회 30일 → 2회 각 30일로 연장 정책이 개선되었습니다.',
    date: '2026.04.28',
  },
  {
    id: 'n4',
    category: '이벤트',
    title: 'QnA 우수 답변 작성자 5월 시상',
    preview: '이번 달 QnA에서 가장 도움이 된 답변을 남긴 수강생 3명에게 교재를 증정합니다.',
    date: '2026.04.20',
  },
  {
    id: 'n5',
    category: '업데이트',
    title: '모바일 앱 1.4.0 업데이트',
    preview: '오프라인 다운로드 안정성을 개선하고, 1.5배속과 1.75배속을 추가했습니다.',
    date: '2026.04.12',
  },
  {
    id: 'n6',
    category: '공지',
    title: '2026 수능 대비 학습 로드맵 공개',
    preview: '1순환 개념 → 2순환 기출 → 3순환 실전, 단계별 추천 커리큘럼을 마이페이지에서 확인하세요.',
    date: '2026.04.01',
  },
];
// ──────────────────────────────────────────────────────────────────────────

export default function NoticePage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_NOTICES;
    const q = search.toLowerCase();
    return MOCK_NOTICES.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.preview.toLowerCase().includes(q)
    );
  }, [search]);

  const handleNoticeClick = (notice: Notice) => {
    // TODO: 공지 상세 페이지 라우팅
    console.log('공지 클릭:', notice.id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 헤더 */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <p className="text-sm text-gray-400 mb-2">
          사회문화 A &nbsp;/&nbsp; 공지사항
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">공지사항</h1>
        <p className="text-sm text-gray-500">
          강좌 운영, 자료 업데이트, 이벤트 등 모든 공지사항을 확인하세요.
        </p>
      </div>

      {/* 구분선 */}
      <div className="border-b border-gray-100" />

      {/* 목록 */}
      <div className="px-8 py-2">
        {filtered.length > 0 ? (
          filtered.map((notice) => (
            <NoticeItem
              key={notice.id}
              notice={notice}
              onClick={handleNoticeClick}
            />
          ))
        ) : (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg mb-1">공지사항이 없어요</p>
            <p className="text-sm">다른 검색어를 입력해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
