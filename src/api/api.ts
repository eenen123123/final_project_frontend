import axios from "axios";

// In-memory access token storage
let inMemoryAccessToken: string | null = null;

export function setApiAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

// 진행 중인 refresh 요청 (동시에 들어온 401/세션복원이 공유)
let refreshPromise: Promise<string> | null = null;

/**
 * Access Token 재발급. 여러 호출이 동시에 들어와도 실제 refresh 요청은 1번만 나가도록
 * in-flight Promise를 공유한다. (서버가 refresh 토큰을 회전시키므로, 동시 호출이
 * 각자 refresh하면 한쪽이 무효화된 토큰으로 실패해 로그인 페이지로 튕긴다)
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post("/api/auth/refresh", {}, { withCredentials: true })
      .then((res) => {
        const newAccessToken = res.data.accessToken;
        setApiAccessToken(newAccessToken);
        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null; // 완료 후 다음 갱신을 위해 해제
      });
  }
  return refreshPromise;
}

/**
 * axios 에러에서 서버가 보낸 에러 메시지({status, message})를 꺼낸다.
 * 서버 메시지가 없으면(네트워크 오류 등) fallback을 반환.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) {
      return data.message;
    }
  }
  return fallback;
}

interface RetryableRequestConfig {
  _retry?: boolean;
  headers?: Record<string, string>;
  url?: string;
  withCredentials?: boolean;
}

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "",
});

// 요청시 Access Token을 헤더에 포함시키는 인터셉터
api.interceptors.request.use((config) => {
  config.withCredentials = true; // 쿠키 포함
  if (inMemoryAccessToken) {
    // console.log("API 요청에 Access Token 포함:", inMemoryAccessToken);
    config.headers["Authorization"] = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

// 응답 인터셉터: 401 또는 403 에러 발생 시 토큰 재발급 시도
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";

    if (
      // 토큰 재발급 시도는 한 번만 수행하도록 _retry 플래그 사용
      !originalRequest ||
      originalRequest._retry ||
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/logout") ||
      requestUrl.includes("/api/auth/refresh") ||
      (status !== 401 && status !== 403)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken(); // 동시 401은 refresh 1회를 공유

      originalRequest.headers = originalRequest.headers ?? {}; // 헤더 객체가 없는 경우 초기화
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // 원래 요청의 헤더에 새 토큰 설정
      originalRequest.withCredentials = true; // 쿠키 포함

      return api(originalRequest); // 원래 요청 재시도
    } catch (refreshError) {
      setApiAccessToken(null); // 토큰 재발급 실패 시 토큰 제거

      if (window.location.pathname !== "/login") {
        console.log("토큰 재발급 실패, 로그인 페이지로 리다이렉트");

        window.location.replace("/login"); // 로그인 페이지로 리다이렉트
      }

      return Promise.reject(refreshError);
    }
  },
);

export async function downloadFile(fileServerId: number, fileName: string) {
  const res = await api.get(`/api/files/${fileServerId}/download`, { responseType: "blob" });
  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export default api;
