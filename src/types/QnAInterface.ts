export type AnswerStatus = '전체' | '답변 완료' | '답변 대기';
 
export interface Question {
  id: string;
  index: number;           // #001, #002 ...
  lectureIndex: number;    // 몇 강
  title: string;
  preview: string;
  status: Exclude<AnswerStatus, '전체'>;
  author: string;
  date: string;
  answerCount: number;
}
 