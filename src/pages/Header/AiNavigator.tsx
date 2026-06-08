import React, { useState } from 'react';

// 대성마이맥 HTML 기반 실시간 입시 뉴스 및 보도자료 데이터
const IN_SERVICE_NEWS = [
  { id: 10630, grade: '고3', category: '입시전략', title: `[단독] [2027수시] SKY 7119명(61.3%).. 학종 5225명(45%) '유일 확대전형'` },
  { id: 10633, grade: '고3', category: '입시전략', title: `[단독] [2027수시] 상위15개대 2만9454명(59.4%) '확대'..반도체학과 5개교 210명` },
  { id: 10635, grade: '고3', category: '입시전략', title: `[단독][2027수시] 의대 39개교 2524명(72%) '확대'.. 학종35% '최대 전형 부상'` },
  { id: 10600, grade: '고2', category: '입시전략', title: `[단독] 5등급제 '2학기 누적 2028 배치표 최초 공개'.. '인서울 1.583등급'` },
  { id: 10592, grade: '고2', category: '입시전략', title: `[단독] [2028대입] 학종 평가 틀 재설계 신호탄.. 정성평가 "학습과정 해석 중심 평가" 강조` },
  { id: 10587, grade: '고2', category: '입시전략', title: `[단독]대교협 2028 대학별/권역별 권장과목 공개.. 고교학점제 '과목선택 핵심 변수 부상'` }
];

// 주요 대학 리스트 (클릭 시 해당 대학 전형 요강 검색 매크로로 작동)
const IN_SERVICE_UNIVS = [
  { name: '서울대', logo: 'https://cdnimg.mimacstudy.com/FRONT/ipsi/logo/001.jpg', url: 'http://admission.snu.ac.kr/' },
  { name: '연세대', logo: 'https://cdnimg.mimacstudy.com/FRONT/ipsi/logo/069.jpg', url: 'http://admission.yonsei.ac.kr/seoul/' },
  { name: '고려대', logo: 'https://cdnimg.mimacstudy.com/FRONT/ipsi/logo/029.jpg', url: 'http://oku.korea.ac.kr/' },
  { name: '이화여대', logo: 'https://cdnimg.mimacstudy.com/FRONT/ipsi/logo/071.jpg', url: 'http://admission.ewha.ac.kr/' },
  { name: '성균관대', logo: 'https://cdnimg.mimacstudy.com/FRONT/ipsi/logo/059.jpg', url: 'http://admission.skku.edu/' },
  { name: '서강대', logo: 'https://cdnimg.mimacstudy.com/FRONT/ipsi/logo/049.jpg', url: 'http://admission.sogang.ac.kr/' }
];

// 입시 검색 엔진용 추천 질의 퀵 키워드
const IPSI_KEYWORDS = [
  '#2027 수시 요약 📝',
  '#의대 증원 인원 비교',
  '#6평 등급컷 분석',
  '#고교학점제 권장과목',
  '#학종 평가 기준 변경점',
  '#🚨2028 전형계획 가이드',
];

// 💡 최고의 입시 검색엔진용 사이드바 메뉴 카테고리 정의
const SEARCH_CATEGORIES = [
  {
    title: '🔍 대학별 전형 요강 검색',
    items: ['서울대 수시 전형 요약', '연세대 수능 최저학력기준', '고려대 면접 반영 비율', '성균관대 학생부 반영 방법']
  },
  {
    title: '📊 모의고사/학평 분석 검색',
    items: ['2026년 6월 모평 출제경향', '5월 더프모 영역별 난이도', '국어/수학 오답률 베스트 문항']
  },
  {
    title: '📰 입시 트렌드 & 보도자료',
    items: ['의과대학 학생정원 배정안', '대교협 권역별 권장과목 뉴스', '2028학년도 대입 수능 예시문항']
  }
];

export default function AiNavigator() {
  const [currentGrade, setCurrentGrade] = useState('고3·N수');
  const [activeTab, setActiveTab] = useState('입시 핫이슈');
  const [selectedSubject, setSelectedSubject] = useState('국어');
  const [mockExam, setMockExam] = useState('2026년 6월 모의평가');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 0, sender: 'ai', text: '안녕하세요! 입시 전용 AI 검색 엔진입니다. 복잡한 대학별 모집요강, 전형계획, 모의고사 분석 자료 중 찾고 싶으신 내용을 입력하시면 Gemma가 신속하게 찾아드립니다.' }
  ]);

  // 사이드바 카테고리 아코디언 상태 (전부 열림)
  const [openSections, setOpenSections] = useState<number[]>([0, 1, 2]);

  const toggleSection = (index: number) => {
    if (openSections.includes(index)) {
      setOpenSections(openSections.filter((i) => i !== index));
    } else {
      setOpenSections([...openSections, index]);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const input = chatInput;
    setMessages((prev) => [...prev, { id: prev.length, sender: 'user', text: input }]);
    setChatInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length, sender: 'ai', text: `입력하신 입시 키워드 "${input}"에 대해 입시 데이터베이스 및 대학별 모집요강 PDF를 검색하고 있습니다. 기능 연동 시 Gemma 모델이 실시간 매칭된 최신 입시 정보를 가공하여 정확하게 답변을 제공하게 됩니다.` }
      ]);
    }, 500);
  };

  const handleKeywordClick = (keyword: string) => {
    setChatInput(`${keyword}에 대해서 검색해 줘.`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50/50 font-sans text-gray-800">

      {/* 상단 헤더 바 */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-10">
        <div className="flex justify-between items-center px-6 py-3.5 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-5">
            <div className="text-lg font-bold tracking-tight text-blue-600 flex items-center gap-2">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-xs font-semibold">AI</span>
              <span>입시 데이터 검색엔진</span>
            </div>
            <div className="flex bg-gray-100 rounded-full p-1 text-xs font-semibold">
              {['고3·N수', '고2', '고1'].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setCurrentGrade(grade)}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    currentGrade === grade ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600">
            2027학년도 수능 <span className="text-blue-600 font-bold">D-164</span>
          </div>
        </div>
      </header>

      {/* 3분할 메인 레이아웃 구역 */}
      <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto px-6 py-5 gap-5">

        {/* 1. 좌측 스마트 검색 카테고리 사이드바 (Width: 20%) */}
        <aside className="w-1/5 bg-white border border-gray-100 rounded-2xl p-4 overflow-y-auto shadow-sm flex flex-shrink-0 flex-col gap-4">
          <div className="border-b border-gray-100 pb-2.5">
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">💡 추천 검색 카테고리</h2>
          </div>
          
          <nav className="flex flex-col gap-1.5">
            {SEARCH_CATEGORIES.map((menu, index) => {
              const isOpen = openSections.includes(index);
              return (
                <div key={menu.title} className="border border-gray-50 bg-gray-50/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex justify-between items-center px-3.5 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span>{menu.title}</span>
                    <span className="text-[10px] text-gray-400 transform transition-transform duration-200">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {isOpen && (
                    <ul className="bg-white border-t border-gray-50 px-2 py-1.5 space-y-0.5">
                      {menu.items.map((item) => (
                        <li key={item}>
                          <button 
                            onClick={() => setChatInput(`${item} 정보 정확하게 찾아줘.`)}
                            className="w-full text-left text-[11px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 px-2.5 py-2 rounded-lg transition-all truncate cursor-pointer font-medium"
                          >
                            🔍 {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* 2. 중앙 실시간 입시 보드 구역 (Width: 50%) */}
        <main className="w-1/2 flex flex-col gap-4 overflow-y-auto pr-1">

          {/* 입시분석실 피드 리스트 */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/80 border-b border-gray-100 px-5 py-3">
              <h2 className="text-sm font-bold text-gray-900">📝 검색엔진 최신 입시 DB 피드</h2>
            </div>
            <div className="flex border-b border-gray-200">
              {['입시 핫이슈', '입시뉴스', '입시전략', '대입 보도자료'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <ul className="p-3 space-y-0.5">
              {IN_SERVICE_NEWS.map((news) => (
                <li key={news.id} className="flex items-center gap-3 py-2.5 px-2 hover:bg-gray-50 rounded-xl transition-colors text-xs">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${
                    news.grade === '고3'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {news.grade}
                  </span>
                  <span className="text-gray-400 font-medium flex-shrink-0">[{news.category}]</span>
                  <span 
                    onClick={() => setChatInput(`"${news.title}" 관련 데이터 상세 분석 브리핑해 줘.`)}
                    className="text-gray-700 hover:text-blue-600 cursor-pointer flex-1 truncate font-medium transition-colors"
                  >
                    {news.title}
                  </span>
                  <span className="text-[10px] text-white font-semibold bg-blue-600 px-1.5 py-0.5 rounded flex-shrink-0">DB 매칭</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 주요 대학 색인 바로가기 링크 */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/80 border-b border-gray-100 px-5 py-3 flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900">🏫 주요 대학 요강 AI 색인</h2>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {IN_SERVICE_UNIVS.map((univ) => (
                <div 
                  key={univ.name} 
                  onClick={() => setChatInput(`${univ.name} 2027학년도 전형 요강 주요 변경사항 검색해 줘.`)}
                  className="border border-gray-100 rounded-2xl p-3 flex flex-col items-center bg-white hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-full border border-gray-100 overflow-hidden flex items-center justify-center bg-white shadow-sm">
                    <img src={univ.logo} alt={univ.name} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mt-2 group-hover:text-blue-600">{univ.name} 요강 검색</h3>
                  <div className="w-full mt-3 text-center text-[10px] text-gray-400 font-medium bg-gray-50 py-1 rounded-md border border-gray-100">
                    전형 PDF 스캔 완료
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 수능·모평·학평 통계 데이터 보드 */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/80 border-b border-gray-100 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-gray-900">📊 평가원 통계 데이터베이스 조회</h2>
              <div className="flex items-center gap-2">
                <select
                  value={mockExam}
                  onChange={(e) => setMockExam(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl text-xs font-medium px-3 py-1.5 text-gray-600 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option>2026년 6월 모의평가</option>
                  <option>2026년 5월 더프모</option>
                  <option>2026년 3월 학평</option>
                </select>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl text-xs font-medium px-3 py-1.5 text-gray-600 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option>국어</option>
                  <option>수학</option>
                  <option>영어</option>
                  <option>사회탐구</option>
                  <option>과학탐구</option>
                </select>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-blue-600 block mb-2">확정 등급컷 통계</span>
                <table className="w-full text-xs text-left border-collapse border border-gray-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500">
                      <th className="p-2.5 font-semibold border-r border-gray-200">등급</th>
                      <th className="p-2.5 font-semibold border-r border-gray-200">원점수</th>
                      <th className="p-2.5 font-semibold">표준점수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr>
                      <td className="p-2.5 font-bold text-blue-600 bg-blue-50/30 border-r border-gray-200">1등급</td>
                      <td className="p-2.5 font-medium border-r border-gray-200">89점</td>
                      <td className="p-2.5">132점</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium border-r border-gray-200">2등급</td>
                      <td className="p-2.5 font-medium border-r border-gray-200">80점</td>
                      <td className="p-2.5">125점</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium border-r border-gray-200">3등급</td>
                      <td className="p-2.5 font-medium border-r border-gray-200">72점</td>
                      <td className="p-2.5">118점</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-2">DB 수집 오답률 상위 문항</span>
                <div className="space-y-2">
                  {[
                    { num: 1, info: '34번 (빈칸추론)', rate: '74%' },
                    { num: 2, info: '22번 (미적분)', rate: '68%' },
                    { num: 3, info: '39번 (문장삽입)', rate: '61%' }
                  ].map((item) => (
                    <div 
                      key={item.num} 
                      onClick={() => setChatInput(`${mockExam} ${selectedSubject} 오답률 ${item.num}위였던 ${item.info} 해설 요약해 줘.`)}
                      className="flex items-center justify-between text-xs p-2.5 border border-gray-100 rounded-xl bg-gray-50/50 cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600 bg-white border border-blue-200 px-1.5 py-0.5 rounded-md">{item.num}</span>
                        <span className="font-medium text-gray-600">{item.info}</span>
                      </div>
                      <span className="font-bold text-red-500">{item.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* 3. 우측 Gemma 입시 검색 전용 챗봇 인터페이스 구역 (Width: 30%) */}
        <aside className="w-1/3 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">

          <div className="px-4 py-3.5 bg-blue-600 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold text-sm tracking-tight">Gemma 입시 검색 센터</span>
            </div>
            <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">ENGINE READY</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
            <p className="text-[11px] font-semibold text-gray-500 mb-2 px-1">추천 검색 키워드 패널</p>
            <div className="flex flex-wrap gap-1.5">
              {IPSI_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordClick(keyword)}
                  className="text-xs bg-white text-gray-600 border border-gray-200 hover:border-blue-600 hover:text-blue-600 px-2.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="찾으시는 대학교 전형이나 모의고사 문항을 검색하세요..."
              className="flex-1 border border-gray-200 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:opacity-90 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              검색하기
            </button>
          </form>
        </aside>

      </div>
    </div>
  );
}