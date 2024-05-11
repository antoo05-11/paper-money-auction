import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import { AUTH, HTTP_STATUS } from "@/lib/constant/constant";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://paper-money-auction.onrender.com/";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   "http://localhost:5050/";

const service = axios.create({
  withCredentials: false,
  baseURL: API_BASE_URL,
  timeout: process.env.NEXT_PUBLIC_APP_API_TIMEOUT
    ? +process.env.NEXT_PUBLIC_APP_API_TIMEOUT
    : 60000,
});

service.interceptors.request.use(
  (config: any) => {
    const user = Cookies.get("user");
    if (user) {
      const accessToken = JSON.parse(user).token;
      config.headers["Authorization"] = accessToken;
    }

    return config;
  }
  // (error: any) => {
  //   return Promise.reject(error);
  // }
);

// response interceptor
service.interceptors.response.use(
  (response: any) => response
  // (error: any) => {
  //   if (error.response) {
  //     if (error.response.status == HTTP_STATUS.FORBIDDEN) {
  //       // if (Object.values(AUTH).some(item => item.code === (error.response.data.code))) {
  //       //   toast.error(error.response.data.message + 'Please sign in.');
  //       //   setTimeout(() => window.location.href = '/login/signin', 4000);
  //       // }
  //       // return Promise.resolve({
  //       //   status: HTTP_STATUS.UNAUTHORIZED
  //       // })
  //     }
  //   }
  //   return Promise.reject(error);
  // }
);

export default service;
