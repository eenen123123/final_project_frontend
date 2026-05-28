import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface SignUpForm {
  userId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  gender: string;
  birthDate: string;
  telno: string;
  emailAddr: string;
  emailCode?: string;
  zip: string;
  addr: string;
  daddr: string;
}

export default function SignUp() {
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [timer, setTimer] = useState(600); // 남은 초 (10분)
  const [timerActive, setTimerActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive]);
  const [formData, setFormData] = useState<SignUpForm>({
    userId: "",
    password: "",
    passwordConfirm: "",
    name: "",
    gender: "",
    birthDate: "",
    telno: "",
    emailAddr: "",
    emailCode: "",
    zip: "",
    addr: "",
    daddr: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    const required: (keyof SignUpForm)[] = [
      "userId",
      "password",
      "passwordConfirm",
      "name",
      "gender",
      "birthDate",
      "telno",
      "emailAddr",
      "zip",
      "addr",
    ];
    if (required.some((k) => !formData[k])) {
      alert("모든 필수 항목을 입력해주세요.");
      return false;
    }
    if (formData.userId.length < 4 || formData.userId.length > 20) {
      alert("ID는 4자 이상 20자 이하로 입력해야 합니다.");
      return false;
    }
    if (formData.password.length < 8 || formData.password.length > 20) {
      alert("비밀번호는 8자 이상 20자 이하로 입력해야 합니다.");
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return false;
    }

    if (formData.name.length < 2 || formData.name.length > 50) {
      alert("이름은 2자 이상 50자 이하로 입력해야 합니다.");
      return false;
    }
    if (!/^010-\d{3,4}-\d{4}$/.test(formData.telno)) {
      alert("전화번호는 010-0000-0000 형식이어야 합니다.");
      return false;
    }

    if (!emailConfirmed) {
      alert("이메일 인증이 필요합니다.");
      return false;
    }
    return true;
  };

  const handleGetEmailCode = async () => {
    if (!formData.emailAddr) {
      alert("이메일 주소를 입력해주세요.");
      return;
    }
    if (timerActive) {
      alert("인증번호가 이미 발송되었습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    try {
      // await axios.post("http://localhost:8081/api/member/email-code", { emailAddr: formData.emailAddr });
    } catch (error) {
      console.error("인증번호 발송 실패", error);
      return;
    }
    setTimer(600);
    setTimerActive(true);
  };

  const handleConfirmEmailCode = () => {
    // TODO: 서버에서 인증번호 검증
    setEmailConfirmed(true);
    setTimerActive(false);
  };

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post("http://localhost:8081/api/member/signup", formData);
      alert("회원가입이 완료되었습니다.");
      // navigate("/login");
    } catch (error) {
      console.error("회원가입 실패", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* 상단 헤더 */}
          <div className="bg-blue-950 px-8 py-6">
            <p className="text-amber-400 text-xs tracking-widest mb-1">
              Hermes
            </p>
            <h1 className="text-white text-2xl font-bold">회원가입</h1>
            <p className="text-blue-300 text-sm mt-1">
              헤르메스 회원이 되어 다양한 강의를 만나보세요.
            </p>
          </div>

          {/* 폼 영역 */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <Field label="아이디" required>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="4~20자"
                className={inputCls}
              />
            </Field>

            <Field label="비밀번호" required>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="8~20자"
                className={inputCls}
              />
            </Field>

            <Field label="비밀번호 확인" required>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="8~20자"
                className={inputCls}
              />
            </Field>

            <Field label="이름" required>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="성별" required>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">선택</option>
                  <option value="M">남</option>
                  <option value="F">여</option>
                </select>
              </Field>

              <Field label="생년월일" required>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="전화번호" required>
              <input
                type="text"
                name="telno"
                value={formData.telno}
                onChange={handleChange}
                placeholder="010-0000-0000"
                className={inputCls}
              />
            </Field>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                이메일<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="emailAddr"
                  value={formData.emailAddr}
                  onChange={handleChange}
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={handleGetEmailCode}
                  className="shrink-0 px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  인증번호 받기
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  인증번호<span className="text-red-500 ml-0.5">*</span>
                </label>
                {timerActive && (
                  <span className="text-xs text-red-500 font-mono">
                    {formatTimer(timer)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="emailCode"
                  value={formData.emailCode}
                  onChange={handleChange}
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={handleConfirmEmailCode}
                  className="shrink-0 px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  인증번호 확인
                </button>
              </div>
              {emailConfirmed && (
                <p className="text-xs text-green-600">
                  이메일 인증이 완료되었습니다.
                </p>
              )}
            </div>

            <Field label="우편번호" required>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            <Field label="주소" required>
              <input
                type="text"
                name="addr"
                value={formData.addr}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            <Field label="상세주소">
              <input
                type="text"
                name="daddr"
                value={formData.daddr}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            <p className="text-xs text-gray-400">
              <span className="text-red-500">*</span> 필수 입력 항목
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-950 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
              >
                회원가입
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                로그인으로 돌아가기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition-colors";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
