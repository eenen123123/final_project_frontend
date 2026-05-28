import axios from "axios";

// In-memory access token storage
let inMemoryAccessToken: string | null = null;

export function setApiAccessToken(token: string | null) {
  inMemoryAccessToken = token;
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
      const refreshResponse = await axios.post(
        "http://localhost:8081/api/auth/refresh",
        {},
        { withCredentials: true },
      );
      const newAccessToken = refreshResponse.data.accessToken;
      setApiAccessToken(newAccessToken); // 인스턴스의 토큰 업데이트

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

export default api;
