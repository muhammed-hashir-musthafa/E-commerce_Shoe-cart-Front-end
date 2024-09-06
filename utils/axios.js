import axios from "axios";

// const baseUrl = import.meta.env.VITE_USER_API;
// console.log(baseUrl);

const baseUrl = "http://localhost:3001/api"
console.log(baseUrl)

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("getToken");
    if (token) {
      request.headers["Authorization"] = `${token}`;
    }
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use((response) => response),
  (error) => Promise.reject(error);

export default api;
