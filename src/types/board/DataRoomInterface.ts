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
