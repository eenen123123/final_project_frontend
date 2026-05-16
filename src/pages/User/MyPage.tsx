import { useAuth } from "../../auth/AuthContext";

export default function MyPage() {
  const { getUserId } = useAuth();
  const userId = getUserId();
  return (
    <>
      <div>마이페이지입니다.</div>
      <div>사용자 아이디: {userId}</div>
    </>
  );
}
