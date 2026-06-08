import type { JSONContent } from "@tiptap/react";

// ── FAQ ─────────────────────────────────────────────────
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

// ── 공지사항 ─────────────────────────────────────────────
export interface NoticeItem {
  postSn: number;
  noticeTypeCd: string;
  noticeTypeNm: string;
  postSj: string;
  postCn: string;
  wrtrUserId: string;
  topFixOrd: number;
  popupExpsYn: string;
  regDt: string;
  mdfcnDt: string;
}

// ── 자료실 ───────────────────────────────────────────────
export interface DataRoomItem {
  postSn: number;
  dataCtg: string;
  dataCtgNm: string;
  accsLmtCd: string;
  accsLmtNm: string;
  postSj: string;
  postCn: string;
  wrtrUserId: string;
  orgnFileNm: string | null;
  savePathNm: string | null;
  fileSizeCnt: number | null;
  regDt: string;
  mdfcnDt: string;
}

// ── QnA ─────────────────────────────────────────────────
export interface QnaItem {
  postSn: number;
  qnaCtgCd: string;
  qnaCtgNm: string;
  secrYn: string;
  answStatCd: string;
  answStatNm: string;
  answCn: JSONContent;
  answrUserId: string;
  answDt: string;
  postSj: string;
  postCn: JSONContent;
  wrtrUserId: string;
  regDt: string;
  mdfcnDt: string;
}

export interface QnaCreateRequest {
  qnaCtgCd: string;
  secrYn: string;
  postSj: string;
  postCn: JSONContent | null;
  wrtrUserId: string;
}

export interface QnaPageProps {
  myOnly?: boolean;
}
