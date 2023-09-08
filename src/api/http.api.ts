import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readToken } from '@app/services/localStorage.service';
console.log("🚀 ~ file: http.api.ts:5 ~ readToken:", readToken)

export const httpApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

httpApi.interceptors.request.use((config) => {
  config.headers = { ...config.headers, Authorization: `${readToken()}` };

  return config;
});

httpApi.interceptors.response.use(
  (response) => {
    // Handle successful responses here
    return response;
  },
  (error) => {
   
    if (error.response && error.response.status === 400) {
      throw error.response.data.error;
    }
    throw error; // Re-throw the error for other cases
  }
);


export interface ApiErrorData {
  message: string;
  error: string;
}
