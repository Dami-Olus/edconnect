import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const res = await api.post('/auth/register', {
    name,
    email,
    password,
    role,
  });
  return res.data;
};
