import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "data",
  timeout: 1000 * 60 * 15,
  headers: {
    'Content-Type': 'application/json',
  } ,
} as any)

export default api