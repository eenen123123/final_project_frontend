import api from "./api";

export interface ChildInfo {
  studentId: string;
  studentName: string;
  enrlSchlNm: string | null;
  classSn: number;
  classroomName: string;
  instructorName: string;
  enrollStartDate: string;
  assignmentRate: number | null;
  recentExamAvgScore: number | null;
}

export interface AttendanceIssueRecord {
  day: number;
  status: "ABSENT" | "LATE" | "EARLY_LEAVE";
  note: string | null;
}

export interface AttendanceIssueResponse {
  year: number;
  month: number;
  lateCount: number;
  absentCount: number;
  earlyLeaveCount: number;
  records: AttendanceIssueRecord[];
}

export interface AttendanceSummary {
  lateCount: number;
  absentCount: number;
  earlyLeaveCount: number;
}

export interface AssignItem {
  asgmtSn: number;
  asgmtNm: string;
  dueDt: string | null;
  submitted: boolean;
  score: number | null;
}

export interface ExamItem {
  examSn: number;
  examNm: string;
  examStrtDt: string | null;
  examEndDt: string | null;
  status: "UPCOMING" | "ONGOING" | "CLOSED";
  attempted: boolean;
  score: number | null;
}

export const parentApi = {
  getChildren: () =>
    api.get<ChildInfo[]>("/api/parent/children").then((r) => r.data),

  getAttendance: (studentId: string, year: number, month: number) =>
    api
      .get<AttendanceIssueResponse>(`/api/parent/children/${studentId}/attendance`, {
        params: { year, month },
      })
      .then((r) => r.data),

  getAttendanceSummary: (studentId: string) =>
    api
      .get<AttendanceSummary>(`/api/parent/children/${studentId}/attendance/summary`)
      .then((r) => r.data),

  getAssignments: (studentId: string, classSn: number) =>
    api
      .get<AssignItem[]>(
        `/api/parent/children/${studentId}/assignments`,
        { params: { classSn } },
      )
      .then((r) => r.data ?? []),

  getExams: (studentId: string, classSn: number) =>
    api
      .get<ExamItem[]>(`/api/parent/children/${studentId}/exams`, {
        params: { classSn },
      })
      .then((r) => r.data ?? []),
};
