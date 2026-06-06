import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Navigation as NavIcon, HelpCircle, Heart } from 'lucide-react';

// 1. 교재 정보 데이터 인터페이스 규격 선언
interface BookItem {
  id: string;
  title: string;
  teacher: string;
  subject: string;
  price: number;
  originalPrice: number;
  status: '입고완료' | '입고대기';
  desc: string[];
  linkedLecture: string;
  coverColor: string;
  teacherRealMatch?: string;   // 💡 선택적 속성(?)으로 명세서에 정식 등록합니다.
  titleAlternative?: string;   // 💡 명세서에 등록해야 아래 더미데이터에서 에러가 안 납니다.
}

const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`text-xs px-3.5 py-1.5 rounded-md border transition-all cursor-pointer whitespace-nowrap
      ${
        active
          ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-sm shadow-blue-100'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
      }`}
  >
    {label}
  </button>
);

export default function BookMain() {
  const [selectedArea, setSelectedArea] = useState<string>('0001');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('전체');

  const dDay = '166';

  // 상단 과목 탭 매핑 정보
  const subjectMap = [
    { id: '0001', name: '국어' },
    { id: '0003', name: '수학' },
    { id: '0002', name: '영어' },
    { id: '0004', name: '사탐' },
    { id: '0005', name: '과탐' },
    { id: '0016', name: '한국사' },
    { id: '0006', name: '제2외/한문' },
    { id: '0007', name: '대학별고사' },
    { id: '0008', name: '모의고사' },
  ];

  // 강사 필터 데이터 세트
  const teachersBySubject: Record<string, string[]> = {
    '0001': ['전체', '박상호', '김국어', '이문학', '민국어', '송문학'],
    '0003': ['전체', '이지은', '이도현', '정유진', '주수학', '윤기하'],
    '0002': ['전체', '최영어', '박독해', '이어법', '아이린', '장현명'],
    '0004': ['전체', '김윤리', '임정환', '이형수', '권용기', '전성오', '최여름', '민준호'],
    '0005': ['전체', '방인혁', '홍진수', '김준', '장성문', '홍준용', '박선우', '이훈식', '엄기은', '정성태'],
    '0016': ['전체', '권용기', '안현준', '연미정'],
    '0006': ['전체', '지은경', '신승', '리하이', '이아영', '황선아'],
    '0007': ['전체', '김용서', '신재호', '유제승', '신한종', '이상인', '홍창우'],
    '0008': ['전체', '이감 모의고사', '상상 모의고사', '강대모의고사', '히든카이스', '더 프리미엄 모의고사']
  };

  // 도서 상세 더미 데이터 세트
  const fullBookListBySubject: Record<string, BookItem[]> = {
    '0001': [
      {
        id: 'EB-KO1',
        title: 'New 2027 훈련도감 - E 수특정복 [현대시]',
        teacher: '박상호',
        subject: '국어',
        price: 25000,
        originalPrice: 25000,
        status: '입고완료',
        desc: [
          'EBS 연계 교재에 실린 모든 현대시 작품의 분석 수록',
          '수능, 모의평가, 학력평가 기출 문제들을 모두 모아 친절한 해설과 함께 수록',
        ],
        linkedLecture: 'New 2027 훈련도감 - E 수특정복 현대시',
        coverColor: 'bg-rose-800',
      },
      {
        id: 'EB-KO2',
        title: 'New 2027 홀수 기출 평가원 최신 [문학]',
        teacher: '김국어',
        subject: '국어',
        price: 30000,
        originalPrice: 30000,
        status: '입고완료',
        desc: ['최신 6개년 평가원 문학 기출 트렌드 분석', '전 지문, 전 문항 입체 해설 수록'],
        linkedLecture: 'New 2027 홀수로 문학 외 1개 강좌',
        coverColor: 'bg-purple-900',
      },
      {
        id: 'EB-KO3',
        title: '2026 문법백제 V2.0 고난도 공략집',
        teacher: '이문학',
        subject: '국어',
        price: 22000,
        originalPrice: 22000,
        status: '입고완료',
        desc: ['1등급으로 가는 완벽한 디딤돌이 되어줄 구조독해 비책', '수능형 제작 모의고사 최신 개정판'],
        linkedLecture: '2026 [언어와 매체] 문법백제 정규 커리큘럼',
        coverColor: 'bg-sky-700',
      },
    ],
    '0003': [
      {
        id: 'EB-MA1',
        title: 'New 2027 기출고백 실전 테크닉 [수Ⅰ+수Ⅱ]',
        teacher: '이지은',
        subject: '수학',
        price: 24000,
        originalPrice: 24000,
        status: '입고완료',
        desc: ['평가원 기출의 완벽한 4점 행동 영역 가이드라인 제시', '실전에서 바로 꺼내 쓰는 문제 조건 해석법'],
        linkedLecture: 'New 2027 기출고백 수학 행동영역 완성',
        coverColor: 'bg-emerald-800',
      },
      {
        id: 'EB-MA2',
        title: '개념공략법 단기 속성 완성 [확률과 통계]',
        teacher: '이do현',
        teacherRealMatch: '이도현', // 💡 선택적 속성 등록으로 에러가 완벽히 차단됩니다.
        titleAlternative: 'New 2027 개념공략법 [확통]',
        subject: '수학',
        price: 25000,
        originalPrice: 25000,
        status: '입고완료',
        desc: ['기초부터 심화 킬러 로직까지 조건문 형태 분석 및 공략법', '확률과 통계 필수 유형 핵심 마스터 백'],
        linkedLecture: 'New 2027 개념공략법 [확통] 패키지 본강좌',
        coverColor: 'bg-cyan-800',
      }
    ],
    '0002': [
      {
        id: 'EB-EN1',
        title: '2027 수능특강 씹어먹는 구문 독해',
        teacher: '최영어',
        subject: '영어',
        price: 18000,
        originalPrice: 18000,
        status: '입고완료',
        desc: ['EBS 수능특강 전 지문 고난도 구문 완벽 팩트 분석', '구조 분석을 통한 절대평가 1등급 메이커'],
        linkedLecture: '2027 씹어먹는 영어 구문독해 특강',
        coverColor: 'bg-blue-900',
      }
    ],
    '0004': [
      {
        id: 'EB-SO1',
        title: '출제자의 눈을 꿰뚫는 사회문화 기출 백서',
        teacher: '임정환',
        subject: '사탐',
        price: 26000,
        originalPrice: 26000,
        status: '입고완료',
        desc: ['표 통계 문항 타임어택 완벽 극복을 위한 특수 알고리즘', '함정 선지 완벽 가려내기 트레이닝'],
        linkedLecture: '2027 사회문화 출제자의 눈 기출 마스터',
        coverColor: 'bg-amber-800',
      }
    ],
    '0005': [
      {
        id: 'EB-SC1',
        title: '엄메이징 최우수 N제 [지구과학Ⅰ]',
        teacher: '엄기은',
        subject: '과탐',
        price: 22000,
        originalPrice: 22000,
        status: '입고완료',
        desc: ['지구과학 천체 및 지질 파트 고난도 자료 완벽 해독', '실전 모의고사 연계용 심화 N제 세트'],
        linkedLecture: '2027 엄메이징 지구과학 완벽 분석반',
        coverColor: 'bg-teal-900',
      }
    ]
  };

  // 필터 연산 조건 처리
  const currentBooks = (fullBookListBySubject[selectedArea] || []).filter(
    (b) => selectedTeacher === '전체' || b.teacher === selectedTeacher || (b.teacher === '이do현' && selectedTeacher === '이도현')
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-5">

        {/* 상단 타이틀 벨트 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md">
              2027 대입 패키지
            </span>
            <span className="text-xs text-gray-400 font-medium">수능 D-{dDay}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">HERMES 강의 교재</h3>
          <p className="text-sm text-gray-500 mt-1">과목별, 강사별 최신 입고 완료 교재들을 한눈에 확인하고 구매하실 수 있습니다.</p>
        </div>

        {/* 필터 테이블 단원 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse text-left">
            <tbody>
              <tr className="border-b border-gray-100">
                <th className="w-24 sm:w-28 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 uppercase tracking-wider text-center select-none">
                  과목
                </th>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 flex-wrap">
                    {subjectMap.map((tab) => (
                      <FilterPill
                        key={tab.id}
                        label={tab.name}
                        active={selectedArea === tab.id}
                        onClick={() => {
                          setSelectedArea(tab.id);
                          setSelectedTeacher('전체'); 
                        }}
                      />
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-24 sm:w-28 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-500 border-r border-gray-100 uppercase tracking-wider text-center select-none">
                  선생님
                </th>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5 flex-wrap">
                    {(teachersBySubject[selectedArea] ?? ['전체']).map((teacher) => (
                      <FilterPill
                        key={teacher}
                        label={teacher}
                        active={selectedTeacher === teacher}
                        onClick={() => setSelectedTeacher(teacher)}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 교재 목록 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-gray-600">
              총 <b className="text-gray-900 font-semibold">{currentBooks.length}</b>권의 전용 교재
            </span>
            <button className="cursor-pointer">
              <RefreshCw size={15} className="text-gray-400 hover:text-gray-600 transition-colors" />
            </button>
          </div>

          {currentBooks.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-200 mx-auto mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <p className="text-sm text-gray-400 font-medium">선택하신 강사의 전용 교재 리스트가 준비 중입니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {currentBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all border border-gray-100 hover:shadow-md hover:border-gray-200"
                >
                  <div className="flex flex-col md:flex-row gap-8 p-8 items-start md:items-stretch">

                    {/* 북 커버 디자인 팩 */}
                    <div className="flex-shrink-0 flex justify-center md:justify-start">
                      <div className={`w-36 h-48 ${book.coverColor} rounded-r-xl shadow-md p-3 flex flex-col justify-between text-white relative overflow-hidden border-l-4 border-black/20`}>
                        <div className="space-y-1">
                          <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold tracking-widest uppercase">HERMES</span>
                          <h5 className="text-[11px] font-bold leading-tight tracking-tight line-clamp-3 mt-1">{book.title}</h5>
                        </div>
                        <span className="text-[10px] font-medium tracking-tight text-right block opacity-80">{book.teacher === '이do현' ? '이도현' : book.teacher} 저</span>
                      </div>
                    </div>

                    {/* 중앙 본문 가이드 */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-blue-600">{book.subject}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {book.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">{book.teacher === '이do현' ? '이도현' : book.teacher} 선생님</p>
                        
                        <ul className="space-y-1 pt-1">
                          {book.desc.map((bullet, index) => (
                            <li key={index} className="flex items-start gap-1.5 text-xs text-gray-500 leading-relaxed">
                              <span className="text-blue-400 flex-shrink-0 mt-0.5">·</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="text-xs pt-3 border-t border-gray-100">
                        <span className="font-semibold text-gray-700 block mb-1">[연결강좌]</span>
                        <span className="text-gray-500 hover:text-blue-600 hover:underline cursor-pointer transition-colors">{book.linkedLecture}</span>
                      </div>
                    </div>

                    {/* 결제 판넬 */}
                    <div className="w-full md:w-52 flex flex-col justify-between items-end shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right w-full mb-4">
                        <span className="text-xs text-gray-400 font-medium block mb-0.5">도서 판매가</span>
                        <strong className="text-2xl font-black text-gray-900 tracking-tight">
                          {book.price.toLocaleString()}원
                        </strong>
                      </div>
                      <div className="flex gap-2 w-full">
                        <button className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-xs text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                          장바구니
                        </button>
                        <button className="flex-1 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer whitespace-nowrap shadow-sm">
                          구매하기
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 text-xs border-t border-gray-800 mt-16">
        <div className="border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
            <div className="flex gap-6 font-medium">
              <button className="hover:text-white transition-colors cursor-pointer">회사소개</button>
              <button className="text-blue-400 font-semibold hover:underline cursor-pointer">개인정보처리방침</button>
              <button className="hover:text-white transition-colors cursor-pointer">이용약관</button>
            </div>
            <div className="flex gap-3">
              <button className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 cursor-pointer"><ExternalLink size={13} /></button>
              <button className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 cursor-pointer"><NavIcon size={13} /></button>
              <button className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 cursor-pointer"><HelpCircle size={13} /></button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-gray-500">&copy; HERMES All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}