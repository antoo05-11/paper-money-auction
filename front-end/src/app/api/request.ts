import Cookies from 'js-cookie';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const service = axios.create({
    withCredentials: true,
    baseURL: API_BASE_URL,
    timeout: (process.env.APP_API_TIMEOUT ? +process.env.APP_API_TIMEOUT : 60000)
});

service.interceptors.request.use(
    (config: any) => {
      // do something before request is sent
      const accessToken = Cookies.get('access_token');
      if (accessToken) {
        config.headers['Authorization'] = 'Bearer ' + accessToken;
      }
  
      return config
    },
    (error: any) => {
      // do something with request error
      return Promise.reject(error)
    }
);

export default service;