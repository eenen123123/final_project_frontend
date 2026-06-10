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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        {/* 헤더 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-3xl mb-3">
            👨‍👩‍👧
          </div>
          <h1 className="text-xl font-bold text-slate-800">학부모 등록</h1>
          <p className="text-sm text-slate-400 mt-1">자녀의 학습 현황을 관리하세요</p>
        </div>

        {isAuthenticated ? (
          <>
            {studentInfo ? (
              <>
                {/* 학생 정보 카드 */}
                <div className="bg-slate-50 rounded-xl p-5 mb-6">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">학생 정보</p>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                    {[
                      { label: "이름", value: studentInfo.userName },
                      { label: "생년월일", value: studentInfo.userBirth },
                      { label: "전화번호", value: studentInfo.userTelno },
                      { label: "우편번호", value: studentInfo.userZip },
                      { label: "주소", value: studentInfo.userAddr },
                      { label: "상세 주소", value: studentInfo.userDaddr },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleRegisterParent}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  학부모 등록하기
                </button>
              </>
            ) : (
              <>
                <p className="text-center text-slate-500 text-sm mb-6">
                  버튼을 눌러 자녀의 정보를 불러오세요.
                </p>
                <button
                  onClick={getStudentInfo}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  학생 정보 가져오기
                </button>
              </>
            )}
          </>
        ) : (
          <p className="text-center text-slate-500 text-sm">
            로그인이 필요합니다. 회원가입 또는 로그인 후 학생 정보를 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}
