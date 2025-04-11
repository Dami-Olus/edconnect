'use client';

import { useState } from 'react';
import { register } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { saveToken } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      saveToken(data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Name" required />
        <br />
        <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
        <br />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <br />
        <select name="role" onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
