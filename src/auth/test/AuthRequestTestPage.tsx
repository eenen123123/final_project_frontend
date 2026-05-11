import api from "../../api/api";

/**
 * 인증이 필요한 API 요청을 테스트하는 페이지 컴포넌트
 *
 * @returns 인증 테스트 페이지 JSX 요소
 */
export default function AuthRequestTestPage() {
  const handleTestRequest = async () => {
    try {
      const response = await api.get("http://localhost:8081/api/auth/test");
      console.log("Test Request SuccessFul", response.data);
    } catch (error) {
      console.error("Test Request Failed", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleTestRequest}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        인증 테스트 요청 보내기
      </button>
    </div>
  );
}
