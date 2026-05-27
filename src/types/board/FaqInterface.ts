// FAQ 게시판 인터페이스 

export interface FaqItem {
  postSn: number;
  faqCtgCd: string;
  faqSubCtgCd: string;
  topFixYn: string;
  expsOrd: number;
  postSj: string;
  postCn: string;
  wrtrUserId: string;
  regDt: string;
  faqCtgNm: string;
  faqSubCtgNm: string;
}