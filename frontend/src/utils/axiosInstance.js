import axios from "axios";
// import Cookies from "js-cookie";

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
      // show error and logout
      showSnackbar?.("Authentication required", "error");
      window.location.href = "/";
    } else if (error.response && error.response.status === 500) {
      // 處理 500 錯誤
      const msg =
        error.response.data?.error || "Internal server error occurred.";
      showSnackbar?.(msg, "error");
    } else {
      // 所有其他錯誤也顯示
      const msg =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
      showSnackbar?.(msg, "error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
