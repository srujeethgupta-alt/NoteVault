import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export const authApi = {
  signup(payload) {
    return api.post("/api/auth/signup", payload);
  },
  login(payload) {
    return api.post("/api/auth/login", payload);
  },
  me() {
    return api.get("/api/auth/me");
  },
};

export const notesApi = {
  list() {
    return api.get("/api/notes");
  },
  create(payload) {
    return api.post("/api/notes", payload);
  },
  remove(id) {
    return api.delete(`/api/notes/${id}`);
  },
};

export default api;
