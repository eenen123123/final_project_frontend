import type { JSONContent } from "@tiptap/react";

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
