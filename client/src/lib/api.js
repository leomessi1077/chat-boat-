import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.error || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
