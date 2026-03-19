import axios from "axios";

 export const api = axios.create({
  baseURL: "https://localhost:7214/api/",
  timeout:5000
})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => {
    // 直接回傳後端的資料內容 (ResponseDTO)，把 Axios 的殼剝掉
    return response.data;
  },
  (error) => {
    // 處理 401, 500 等錯誤
    return Promise.reject(error);
  }
);

export default api;
