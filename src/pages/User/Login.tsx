import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/api";

interface LoginProps {
  userId: string;
  userPswd: string;
}

export default function Login() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const [formData, setFormData] = useState<LoginProps>({
    userId: "",
    userPswd: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post("http://localhost:8081/api/auth/login", formData);

      if (response.status === 401 && response.data.message === "유효하지 않은 리프레시 토큰입니다.") {
        logout();
        navigate("/login");
        return;
      }
      const { accessToken } = response.data;
      login(accessToken);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login Failed", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      return;
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">로그인</h2>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="userId" className=" font-medium">
              아이디
            </label>
            <input
              type="text"
              name="userId"
              id="userId"
              value={formData.userId}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2"
            />

            <label htmlFor="userPswd" className=" font-medium">
              비밀번호
            </label>
            <input
              type="password"
              name="userPswd"
              id="userPswd"
              value={formData.userPswd}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2"
            />

            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
              로그인
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
