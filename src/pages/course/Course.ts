export interface Course {
  courseSn: number;
  courseName: string;
  subjectId: number;
  subjectName: string;
  instructorName: string;
  instrUuid: string;
  coursePrice?: number;
  explain: string;
  isBest: boolean;
  isNew: boolean;
  thumbnailImg?: string;
}
