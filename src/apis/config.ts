import { API_BASEURL } from "@/lib/constants";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
