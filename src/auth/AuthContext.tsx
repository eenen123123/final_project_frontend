import { createContext, useContext, useEffect, useState } from "react";
import api, { setApiAccessToken, refreshAccessToken } from "../api/api";

//  JWT 토큰 페이로드 인터페이스 정의
interface TokenPayload {
  exp?: number;
  role?: string[];
  sub?: string;
  userName?: string;
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  accessToken: string | null; // 현재 액세스 토큰 문자열 또는 null
  isAuthReady: boolean; // 인증 상태 초기화 완료 여부
  isAuthenticated: boolean; // 현재 인증된 상태 여부 (액세스 토큰 존재 여부로 판단)
  login: (accessToken: string) => void; // 로그인 처리 함수, 액세스 토큰을 인자로 받아 인증 상태를 업데이트
  logout: () => void; // 로그아웃 처리 함수, 인증 상태를 초기화하고 서버에 로그아웃 요청을 보냄
  getUserId: () => string | null; // 사용자 아이디를 반환하는 함수, 액세스 토큰에서 디코딩하여 사용자 아이디(sub) 추출
  getRole: () => string[] | null; // 사용자 역할을 반환하는 함수, 액세스 토큰에서 디코딩하여 사용자 역할(role) 추출
  getUserName: () => string | null; // 사용자 이름을 반환하는 함수, 액세스 토큰에서 디코딩하여 사용자 이름(userName) 추출
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  /**
   * 로그인 처리 함수
   *
   * @param accessToken
   */
  const login = (accessToken: string) => {
    setApiAccessToken(accessToken);
    setAccessToken(accessToken);
    setIsAuthReady(true);
  };

  /**
   * 로그아웃 처리 함수
   *
   * 액세스 토큰을 제거하고 서버에 로그아웃 요청을 보내며 인증 상태를 초기화한다.
   * 서버에 DB에 저장된 리프레시 토큰도 제거하도록 로그아웃 API를 호출한다.
   * 로그아웃 API 호출 실패 시에도 클라이언트 측에서는 토큰을 제거하고 인증 상태를 초기화한다.
   */
  const logout = () => {
    setApiAccessToken(null);

    api.post("/api/auth/logout").catch((error) => {
      console.error("Logout failed:", error);
    });

    setAccessToken(null); // 클라이언트 측에서 토큰 제거
    setIsAuthReady(true); // 인증 상태 초기화
  };

  /**
   * 사용자 아이디를 반환하는 함수
   *
   * @returns 사용자 아이디 문자열 또는 null
   */
  const getUserId = () => {
    const payload = decodeTokenPayload(accessToken);

    if (!payload?.sub) return null;

    return payload.sub;
  };

  /**
   *  사용자 역할을 반환하는 함수
   *
   * @returns  사용자 역할 문자열 또는 null
   */
  const getRole = () => {
    const payload = decodeTokenPayload(accessToken);

    if (!payload?.role) return null;

    return payload.role;
  };

  const getUserName = () => {
    const payload = decodeTokenPayload(accessToken);

    if (!payload?.userName) return null;

    return payload.userName;
  };

  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      try {
        // 인터셉터 refresh와 동일한 in-flight Promise를 공유 (토큰 회전 경쟁 방지)
        const newAccessToken = await refreshAccessToken();

        if (isMounted) {
          setAccessToken(newAccessToken);
        }
      } catch {
        //
        setApiAccessToken(null);

        if (isMounted) {
          setAccessToken(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };
    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // 인증 컨텍스트 값을 제공하는 Provider 컴포넌트 렌더링
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthReady,
        isAuthenticated: !!accessToken,
        login,
        logout,
        getUserId,
        getRole,
        getUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 *  인증 컨텍스트를 사용하는 커스텀 훅
 *
 * @returns  인증 컨텍스트 값 객체
 * @throws  AuthProvider로 감싸지 않은 컴포넌트에서 사용할 경우 에러 발생
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

/**
 * JWT 토큰에서 페이로드를 디코딩하여 반환하는 함수
 *
 * @param token JWT 액세스 토큰 문자열
 * @returns 디코딩된 토큰 페이로드 객체 또는 null
 */
function decodeTokenPayload(token: string | null): TokenPayload | null {
  if (!token) return null;

  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length).map((_, i) =>
      binary.charCodeAt(i),
    );
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null; // 디코딩 실패 시 null 반환
  }
}
