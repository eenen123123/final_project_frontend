import React, { useState } from 'react';
// Swiper 슬라이더 라이브러리 임포트
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ChevronDown, ChevronUp, RefreshCw, Link, Globe, Info, Heart } from 'lucide-react';

// Swiper 스타일 임포트
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Instructors() {
  // 상태 관리 정의
  const [selectedSubject, setSelectedSubject] = useState<string>('01'); // 기본값: 국어

  // 상단 과목 탭 배열 정보
  const subjectTabs = [
    { id: '01', name: '국어' },
    { id: '02', name: '수학' },
    { id: '03', name: '영어' },
    { id: '04', name: '사회탐구' },
    { id: '05', name: '과학탐구' },
    { id: '10', name: '한국사' },
    { id: '06', name: '제2외국어' },
    { id: '07', name: '대학별고사' },
    { id: '08', name: '모의고사' },
  ];

  // [image_1055a0.png] 실물 도면 텍스트 명단과 100% 동기화된 강사 데이터 세트
  const dynamicTeachers: Record<string, { main: string[]; curri22?: string[]; high12?: string[] }> = {
    '01': {
      main: ['박상호', '김국어', '이문학'],
      curri22: ['박상호', '김국어'],
      high12: ['민국어', '송문학']
    },
    '02': {
      main: ['이지은', '이도현', '정유진'],
      curri22: ['이지은', '정유진'],
      high12: ['주수학', '윤기하']
    },
    '03': {
      main: ['최영어', '박독해', '이어법'],
      curri22: ['최영어', '박독해'],
      high12: ['아이린', '장현명']
    },
    '04': {
      main: ['[생활과 윤리/윤리와 사상] 김윤리', '[사회문화] 임정환', '이형수', '[동아시아사/세계사] 권용기', '[한국지리/세계지리] 전성오', '[정치와 법] 최여름', '[경제] 민준호', '이형수'],
      curri22: ['2022 개정 통합사회/일반선택 과목 라인업 자산 준비 중']
    },
    '05': {
      main: ['[물리학] 방인혁', '홍진수', '[화학] 김준', '장성문', '[생명과학] 홍준용', '박선우', '[지구과학] 이훈식', '엄기은'],
      curri22: ['[통합과학] 정성태']
    },
    '10': {
      main: ['권용기', '안현준', '연미정'],
      curri22: ['권용기', '안현준']
    },
    '06': {
      main: ['[아랍어] 지은경', '[스페인어] 신승', '[중국어] 리하이', '[베트남어] 이아영', '[일본어] 황선아']
    },
    '07': {
      main: ['[인문논술] 김용서', '[수리논술] 신재호', '유제승', '[약술형 논술] 신한종+고지우', '[경찰대/사관학교] 신한종', '이상인', '홍창우', '[구술면접] 유제승']
    },
    '08': {
      main: ['[국어] 이감 모의고사', '상상 모의고사', '[수학] 강대모의고사X', '히든카이스 수학 모의고사', '[전과목] 더 프리미엄 모의고사']
    }
  };

  // 슬라이더 광고 배너 데이터
  const mainBanners = [
    { id: 1, title: '비문학 원리와 실전', desc: '낯선 독서 지문의 지속적 훈련', tag: '정석국어 시즌3', discount: '패키지 10% 할인', bg: 'from-pink-50 to-purple-50' },
    { id: 2, title: '심화부터 연계까지! 수능 트레이닝', desc: '6월 모평 출제경향 완벽 분석', tag: '6월 모평 완벽 대비', discount: '수강생 전원 제공', bg: 'from-green-50 to-emerald-50' }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* 📌 MAIN AREA: 마이페이지 기준과 완벽 매칭되도록 max-w-6xl mx-auto px-6 규격으로 수정 */}
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        
        {/* [좌측 영역] 과목 네비게이션 아코디언 바 */}
        <aside className="col-span-12 md:col-span-3 bg-white border border-gray-200 rounded shadow-sm h-fit">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-base text-gray-900 text-center tracking-tight">HERMES 강사</h2>
          </div>
          <nav className="divide-y divide-gray-100">
            {subjectTabs.map((tab) => {
              const isSelected = selectedSubject === tab.id;
              return (
                <div key={tab.id} className="w-full">
                  <button
                    onClick={() => setSelectedSubject(tab.id)}
                    className={`w-full text-left px-4 py-3 text-sm font-bold flex justify-between items-center transition-colors ${
                      isSelected ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.name}</span>
                    {isSelected ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isSelected && (
                    <div className="px-4 pb-4 pt-2 bg-white text-xs space-y-3 border-t border-gray-50">
                      {/* 기본 선생님 리스트 */}
                      <div className="flex flex-col gap-1.5 text-gray-600 font-medium">
                        {dynamicTeachers[tab.id]?.main.map((t, idx) => (
                          <span key={idx} className="hover:text-blue-600 cursor-pointer">{t}</span>
                        ))}
                      </div>

                      {/* 2022 개정 분과 */}
                      {dynamicTeachers[tab.id]?.curri22 && (
                        <div className="pt-2 border-t border-dashed border-gray-200">
                          <span className="inline-block text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold mb-1.5">2022 개정</span>
                          <div className="flex flex-col gap-1.5 text-gray-500">
                            {dynamicTeachers[tab.id].curri22?.map((t, idx) => (
                              <span key={idx} className="hover:text-blue-600 cursor-pointer">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 고1·2 분과 */}
                      {dynamicTeachers[tab.id]?.high12 && (
                        <div className="pt-2 border-t border-dashed border-gray-200">
                          <span className="inline-block text-[10px] text-blue-600 font-bold mb-1.5">[고1·2]</span>
                          <div className="flex flex-col gap-1.5 text-gray-500">
                            {dynamicTeachers[tab.id].high12?.map((t, idx) => (
                              <span key={idx} className="hover:text-blue-600 cursor-pointer">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* [우측 영역] 탭 변환 가동 판넬 */}
        <section className="col-span-12 md:col-span-9 space-y-4">
          
          {/* 상단 가로형 대분류 탭 제어바 */}
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none">
              {subjectTabs.map((tab) => {
                const isSelected = selectedSubject === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSubject(tab.id)}
                    className={`flex-1 min-w-[80px] text-center py-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                      isSelected 
                        ? 'border-blue-600 text-blue-600 bg-white' 
                        : 'border-transparent text-gray-500 hover:text-gray-900 bg-gray-50/50'
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 프로모션 슬라이더 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              navigation
              pagination={{ clickable: true }}
              className="w-full h-56"
            >
              {mainBanners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <div className={`w-full h-full bg-gradient-to-r ${banner.bg} p-8 flex flex-col justify-center relative`}>
                    <span className="text-xs font-bold text-purple-600 mb-1">{subjectTabs.find(t => t.id === selectedSubject)?.name} 특강 정보</span>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{banner.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 font-medium">{banner.desc}</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-white border border-purple-200 text-purple-700 px-2 py-1 rounded font-semibold">{banner.tag}</span>
                      <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded font-semibold">{banner.discount}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 실시간 알림 피드 바 */}
          <div className="bg-gray-100 border border-gray-200 px-4 py-2.5 rounded flex items-center justify-between text-xs font-medium text-gray-700">
            <div className="flex items-center gap-2 truncate">
              <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">공지</span>
              <p className="truncate">2027학년도 수능 대비 최신 평가원 모의평가 해설 패키지 배포 완료</p>
            </div>
            <span className="text-orange-500 font-bold ml-2 shrink-0">NEW</span>
          </div>

          {/* 메인 라인업 대시보드 그리드 뷰 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                {subjectTabs.find(t => t.id === selectedSubject)?.name} 라인업 명단
              </h3>
              <RefreshCw size={14} className="text-gray-400 cursor-pointer hover:rotate-180 transition-transform duration-500" />
            </div>

            {/* 메인 리스트 렌더링 파트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dynamicTeachers[selectedSubject]?.main.map((teacher, idx) => (
                <div 
                  key={idx} 
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-blue-400 hover:shadow-md transition-all duration-300 group cursor-pointer relative"
                >
                  <button className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors z-10">
                    <Heart size={16} />
                  </button>
                  <div className="p-5 bg-gray-50 flex items-center gap-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-400 text-xs">
                      T
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                        {teacher}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{subjectTabs.find(t => t.id === selectedSubject)?.name} 대표교수</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white flex justify-around text-xs font-semibold text-blue-600">
                    <span className="hover:underline">강좌 홈</span>
                    <span className="text-gray-200">|</span>
                    <span className="hover:underline">맛보기 강좌</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>

      {/* 4. FOOTER AREA: 마이페이지 기준 폭(max-w-6xl, px-6)으로 정렬선 강제 통일 */}
      <footer className="bg-gray-900 text-gray-400 text-xs border-t border-gray-800 mt-20">
        <div className="border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
            <div className="flex gap-6 font-medium">
              <button className="hover:text-white transition-colors">회사소개</button>
              <button className="text-orange-400 font-bold hover:underline">개인정보처리방침</button>
              <button className="hover:text-white transition-colors">이용약관</button>
            </div>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"><Link size={14} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"><Globe size={14} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"><Info size={14} /></a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-4 text-left">
          <p className="text-gray-500">Copyright © since 2012 (주)디지털대성. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}