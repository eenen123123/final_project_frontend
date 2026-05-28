export interface QnaItem {
  postSn: number;
  qnaCtgCd: string;
  qnaCtgNm: string;
  secrYn: string;
  answStatCd: string;
  answStatNm: string;
  answCn: string;
  answrUserId: string;
  answDt: string;
  postSj: string;
  postCn: string;
  wrtrUserId: string;
  regDt: string;
  mdfcnDt: string;
}

export interface QnaCreateRequest {
  qnaCtgCd: string;
  secrYn: string;
  postSj: string;
  postCn: string;
  wrtrUserId: string;
}