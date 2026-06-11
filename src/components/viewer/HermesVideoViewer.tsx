import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../auth/AuthContext";

interface CourseInfo {
  courseSn: number;
  courseName: string;
  instructorName: string;
}

interface LectureItem {
  lectureSn: number;
  lectureName: string;
  lectureDuration: number | null;
  lectureVideoFileId: number;
}

type LectureStatus = "completed" | "current" | "pending";

function getLectureStatus(lectureSn: number, currentLectureSn: number): LectureStatus {
  if (lectureSn === currentLectureSn) return "current";
  return "pending"; // 완료 API 연결 전 전부 pending
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function HermesVideoViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthReady } = useAuth();

  const courseId = searchParams.get("courseId");
  const lectureId = searchParams.get("lectureId");
  const currentLectureSn = lectureId ? Number(lectureId) : null;

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 코스 + 강의 목록 fetch
  useEffect(() => {
    if (!isAuthReady || !courseId) return;
    api.get(`/api/course/${courseId}`)
      .then((res) => {
        setCourse(res.data.course);
        setLectures(res.data.lectures);
      })
      .catch(() => alert("강의 정보를 불러오는 중 오류가 발생했습니다."));
  }, [courseId, isAuthReady]);

  // 현재 강의 영상 URL fetch
  useEffect(() => {
    if (!isAuthReady || !currentLectureSn || lectures.length === 0) return;
    setVideoUrl("");
    const current = lectures.find((l) => l.lectureSn === currentLectureSn);
    if (!current?.lectureVideoFileId) return;
    api.post(`/api/files/${current.lectureVideoFileId}/token`)
      .then((res) => setVideoUrl(res.data.viewUrl))
      .catch((error) => {
        if (error instanceof Error && error.message === "Request failed with status code 403") {
          alert("강의 영상을 볼 수 있는 권한이 없습니다.");
        } else {
          alert("강의 영상을 불러오는 중 오류가 발생했습니다.");
        }
      });
  }, [currentLectureSn, lectures, isAuthReady]);

  const currentLecture = lectures.find((l) => l.lectureSn === currentLectureSn) ?? null;
  const currentIndex = lectures.findIndex((l) => l.lectureSn === currentLectureSn);
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const nextLecture = currentIndex >= 0 && currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

  const goToLecture = (lectureSn: number) => {
    setDrawerOpen(false);
    navigate(`/viewer?courseId=${courseId}&lectureId=${lectureSn}`);
  };

  return <div>로딩 중...</div>; // Task 2에서 교체
}
