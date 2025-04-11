import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // This should be http://localhost:5050
  headers: { 'Content-Type': 'application/json' },
});

export const register = async (name: string, email: string, password: string, role: string) => {
  const res = await api.post('/api/auth/register', { name, email, password, role }); // ← fix here
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post('/api/auth/login', { email, password }); // ← fix here
  return res.data;
};
