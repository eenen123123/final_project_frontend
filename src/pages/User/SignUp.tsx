export default function SignUp() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/api/test/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: "testuser",
          password: "java",
          name: "TestUser",
          nickName: "Tester",
        }),
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
    <div>
      <h1>회원가입 페이지</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="loginId" id="loginId" placeholder="아이디" />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="비밀번호"
        />
        <input type="text" name="name" id="name" placeholder="이름" />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
