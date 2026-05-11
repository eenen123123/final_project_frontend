import { useState } from "react";

interface SignUpProps {
  loginId: string;
  password: string;
  name: string;
  nickName: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<SignUpProps>({
    loginId: "",
    password: "",
    name: "",
    nickName: "",
  });

  const validateForm = (): boolean => {
    if (
      !formData.loginId ||
      !formData.password ||
      !formData.name ||
      !formData.nickName
    ) {
      alert("모든 필드를 입력해주세요.");
      return false;
    }

    // TODO: 유효성 검사 추가하기

    return true;
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch("http://localhost:8081/api/test/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("회원가입 성공");
      } else {
        console.error("회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생", error);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">회원가입 페이지</h1>
      <form onSubmit={handleOnSubmit} className="space-y-4">
        <input
          type="text"
          name="loginId"
          id="loginId"
          placeholder="아이디"
          value={formData.loginId}
          onChange={(e) =>
            setFormData({ ...formData, loginId: e.target.value })
          }
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          name="name"
          id="name"
          placeholder="이름"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          name="nickName"
          id="nickName"
          placeholder="닉네임"
          value={formData.nickName}
          onChange={(e) =>
            setFormData({ ...formData, nickName: e.target.value })
          }
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
