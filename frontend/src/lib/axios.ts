import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5003/api"
      : "https://realtime-spotify-clone-4a90.onrender.com/api",
  withCredentials: true,
});