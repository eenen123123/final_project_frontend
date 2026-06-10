export interface CareerDto {
  careerStrtYr: string;
  careerEndYr: string | null;
  careerCont: string;
}

export interface BookDto {
  careerStrtYr: string;
  careerCont: string;
}

export interface InstructorDetail {
  instrUuid: string;
  userName: string;
  instrIntro: string | null;
  instrProfileImg: string | null;
  subject: string;
  lectureCount: number;
  careers: CareerDto[];
  books: BookDto[];
}

export interface FeaturedCourse {
  courseSn: number;
  courseNm: string;
  display_order: number;
}

export interface Post {
  postSn: number;
  title: string;
  regDt: string;
  boardType: "notice" | "qna" | "dataroom";
}
