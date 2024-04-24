import Cookies from 'js-cookie';
import axios from 'axios';
import { HTTP_STATUS } from '@/lib/constant/constant';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const service = axios.create({
    withCredentials: false,
    baseURL: API_BASE_URL,
    timeout: (process.env.NEXT_PUBLIC_APP_API_TIMEOUT ? +process.env.NEXT_PUBLIC_APP_API_TIMEOUT : 60000)
});

service.interceptors.request.use(
    (config: any) => {
      // do something before request is sent
      const accessToken = Cookies.get('access_token');
      if (accessToken) {
        config.headers['Authorization'] = accessToken;
      }
  
      return config
    },
    (error: any) => {
      // do something with request error
      return Promise.reject(error)
    }
);

// response interceptor
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status == HTTP_STATUS.FORBIDDEN) {
        console.log(error.response.message);
        return Promise.resolve({
          status: HTTP_STATUS.FORBIDDEN
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service;