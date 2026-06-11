import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../auth/AuthContext";

interface Lecture {
  lectureNm: string;
  atchFileId: number;
}

export default function HermesVideoViewer() {
  const [searchParams] = useSearchParams();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const { isAuthReady } = useAuth();

  const courseSn = searchParams.get("courseId");
  const lectureSn = searchParams.get("lectureId");

  useEffect(() => {
    if (isAuthReady && courseSn && lectureSn) {
      const fetchLecture = async () => {
        try {
          const response = await api.get(
            `/api/lecture/info?courseId=${courseSn}&lectureId=${lectureSn}`,
          );
          setLecture(response.data);
          if (response.data.atchFileId) {
            try {
              const res = await api.post(
                `/api/files/${response.data.atchFileId}/token`,
              );
              setVideoUrl(res.data.viewUrl);
            } catch (error) {
              if (
                error instanceof Error &&
                error.message === "Request failed with status code 403"
              ) {
                alert("강의 영상을 볼 수 있는 권한이 없습니다.");
              } else {
                alert("강의 영상을 불러오는 중 오류가 발생했습니다.");
              }
            }
          }
        } catch (error) {
          alert("강의 정보를 불러오는 중 오류가 발생했습니다.");
        }
      };
      fetchLecture();
    }
  }, [courseSn, lectureSn, isAuthReady]);

  console.log("courseSn:", courseSn, "lectureSn:", lectureSn);

  return (
    <div className="w-full">
      <div>{lecture?.lectureNm}</div>
      {lecture?.atchFileId && videoUrl && (
        <video controls className="w-full h-auto">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
