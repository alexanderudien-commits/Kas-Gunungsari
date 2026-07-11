import axios from "axios";

// VITE_API_URL is empty or matches frontend domain in Vercel Rewrites
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL.includes('localhost') ? `${API_URL}/api` : `/api`,
  withCredentials: true,
});
