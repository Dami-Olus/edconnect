'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { saveToken } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const data = await login(form.email, form.password);
      saveToken(data.token);
      router.push('/dashboard'); // change based on user role later
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
        <br />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
