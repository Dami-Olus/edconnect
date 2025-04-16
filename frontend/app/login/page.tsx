'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginPage() {
  const router = useRouter();
  const { saveToken } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(form.email, form.password);
      saveToken(data.token);
      localStorage.setItem('role', data.role);
  
      if (data.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (data.role === 'student') {
        router.push('/student/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <Button type="submit">Login</Button>
        </form>
      </div>
    </Layout>
  );
}
