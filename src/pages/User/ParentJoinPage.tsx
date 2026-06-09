import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/api";

interface StudentInfo {
  userId: string;
  userName: string;
  userTelno: string;
  userBirth: string;
  userZip: string;
  userAddr: string;
  userDaddr: string;
}

/*
학부모 등록시 로그인 여부를 확인,
로그인이 되어있으면 학생 정보를 확인하고 학부모 등록



*/

export default function ParentJoinPage() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const { isAuthenticated } = useAuth();

  const getStudentInfo = async () => {
    try {
      const res = await api.post("/api/parent/join/info", {
        joinLink: window.location.href, // 현재 URL을 joinLink로 전달
      });
      setStudentInfo(res.data);
    } catch (error) {
      console.error("Failed to fetch student info:", error);
    }
  };

  const handleRegisterParent = async () => {
    if (confirm("학부모로 등록하시겠습니까?")) {
      try {
        const res = await api.post("/api/parent/join", {
          studentId: studentInfo?.userId,
          joinLink: window.location.href, // 현재 URL을 joinLink로 전달
        });
        if (res.status === 200) {
          alert("학부모 등록이 완료되었습니다.");
          window.location.href = "/"; // 등록 후 홈으로 이동
        } else {
          alert("학부모 등록에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("Failed to register parent:", error);
        alert("학부모 등록에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">학부모 등록 페이지</h1>
      {isAuthenticated ? (
        <div>
          <button
            onClick={() => getStudentInfo()}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            학생 정보 가져오기
          </button>

          <div className="mt-4">
            {studentInfo ? (
              <div className="border p-4 rounded">
                <div className="bg-gray-100 p-4 rounded">
                  <p>
                    <strong>학생 ID:</strong> {studentInfo.userId}
                  </p>
                  <p>
                    <strong>학생 이름:</strong> {studentInfo.userName}
                  </p>
                  <p>
                    <strong>전화번호:</strong> {studentInfo.userTelno}
                  </p>
                  <p>
                    <strong>생년월일:</strong> {studentInfo.userBirth}
                  </p>
                  <p>
                    <strong>우편번호:</strong> {studentInfo.userZip}
                  </p>
                  <p>
                    <strong>주소:</strong> {studentInfo.userAddr}
                  </p>
                  <p>
                    <strong>상세 주소:</strong> {studentInfo.userDaddr}
                  </p>
                </div>
                <button
                  onClick={() => handleRegisterParent()}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
                >
                  학부모 등록하기
                </button>
              </div>
            ) : (
              <p>학생 정보를 가져오려면 버튼을 클릭하세요.</p>
            )}
          </div>
        </div>
      ) : (
        <p>
          로그인이 필요합니다. 회원가입 또는 로그인 후 학생 정보를 확인하세요.
        </p>
      )}
    </div>
  );
}
