import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api, { getApiErrorMessage } from "../../api/api";

interface AccountInfo {
  userId: string;
  userName: string;
  userRole: string;
  department: string;
  jobGrade: string;
}

interface LoginForm {
  userId: string;
  userPswd: string;
}

export default function Login() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    userId: "",
    userPswd: "",
  });
  const [hidden, setHidden] = useState(true);
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);

  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.post("/api/auth/login", formData);

      if (
        response.status === 401 &&
        response.data.message === "유효하지 않은 리프레시 토큰입니다."
      ) {
        logout();
        navigate("/login");
        return;
      }
      const { accessToken } = response.data;
      login(accessToken);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login Failed", error);

      alert(
        getApiErrorMessage(
          error,
          "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.",
        ),
      );
    }
  };

  const handleHidden = () => {
    setHidden((prev) => !prev);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("/api/temp/accounts");
        setAccounts(response.data);
      } catch (error) {
        console.error("Failed to fetch accounts", error);
      }
    };

    fetchAccounts();
  }, []);

  const bgColor: { [key: string]: string } = {
    "N/A": "bg-red-100",
    행정팀: "bg-indigo-100",
    PD팀: "bg-yellow-100",
    강사팀: "bg-green-100",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-blue-950 px-8 py-6">
            <p className="text-amber-400 text-xs tracking-widest mb-1">
              Hermes
            </p>
            <h1 className="text-white text-2xl font-bold">로그인</h1>
            <p className="text-blue-300 text-sm mt-1">
              헤르메스에 오신 것을 환영합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="userId"
                className="text-sm font-medium text-gray-700"
              >
                아이디
              </label>
              <input
                type="text"
                name="userId"
                id="userId"
                value={formData.userId}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="userPswd"
                className="text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                type="password"
                name="userPswd"
                id="userPswd"
                value={formData.userPswd}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-950 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
        <div>
          <button
            onClick={handleHidden}
            className="w-full py-2.5 mt-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            {hidden ? "열기" : "접기 (클릭해서 아이디 입력)"}
          </button>
        </div>
        <div
          className={`text-center text-sm text-gray-500 mt-6 ${hidden ? "hidden" : ""}`}
        >
          <table className="z-10 w-[700px] border-collapse mx-auto mt-4 text-center absolute left-1/2 -translate-x-1/2 font-bold">
            <thead className="bg-gray-100">
              <tr className="border">
                <th className="px-4 py-2 border">아이디</th>
                <th className="px-4 py-2 border">이름</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">부서</th>
                <th className="px-4 py-2 border">직급</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {accounts.map((account) => (
                <tr
                  key={account.userId}
                  className={`border ${bgColor[account.department] || "bg-gray-50"} cursor-pointer hover:bg-white transition-colors`}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      userId: account.userId,
                    }));
                  }}
                >
                  <td className="border px-4 py-2">{account.userId}</td>
                  <td className="border px-4 py-2">{account.userName}</td>
                  <td className="border px-4 py-2 text-[12px]">
                    {account.userRole}
                  </td>
                  <td className="border px-4 py-2">{account.department}</td>
                  <td className="border px-4 py-2">{account.jobGrade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition-colors";
