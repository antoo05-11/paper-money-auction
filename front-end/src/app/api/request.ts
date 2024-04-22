const axios = require('axios').default;

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const service = axios.create({
    withCredentials: true,
    baseURL: API_BASE_URL,
    timeout: process.env.APP_API_TIMEOUT || 60000 // request timeout
});

const API_ENPOINTS = {

};
service.interceptors.request.use(
    config => {
      // do something before request is sent
  
      if (hasToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
      }
  
      return config
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
);

export default service;