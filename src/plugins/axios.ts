import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { WebHostDomain } from '@/global/EnviromentDefine.ts';

 export const api = axios.create({
  baseURL: WebHostDomain+"api/",
  timeout:5000
})
interface MyTokenPayload {
  exp: number;
  iat?: number;
  [key: string]: any; // 允許其他自定義 Claim
}
//JWT Middleware
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode<MyTokenPayload>(token);
      const currentTime = Date.now() / 1000; // 轉換為秒

      // 如果當前時間大於過期時間，代表已過期
      if (decoded.exp < currentTime) {
        console.warn("Token 已過期，執行登出...");
        localStorage.removeItem("token");
        window.location.href = "/login"; // 導向登入頁
        return Promise.reject("Token expired");
      }

      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Token 解析失敗:", error);
      localStorage.removeItem("token");
    }
  }
  return config;
});
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 檢查後端是否回傳 401 (通常代表 Token 失效)
    if (error.response && error.response.status === 401) {
      console.error("驗證失敗或 Token 已過期");
      localStorage.removeItem("token");

      // 避免在登入頁面重複跳轉
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
