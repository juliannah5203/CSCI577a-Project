import axios from "axios";
import Cookies from "js-cookie";

let showSnackbar = null;

export const setSnackbarHandler = (fn) => {
  showSnackbar = fn;
};

// 建立 axios 實例
const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

// 統一攔截 response，處理未授權情況
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.error === "You are not authenticated"
    ) {
      // 移除 session token
      Cookies.remove("sessionToken");

      // 導回登入頁
      //   window.location.href = "/signin";

      // 顯示錯誤訊息
      showSnackbar?.("Authentication required", "error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
