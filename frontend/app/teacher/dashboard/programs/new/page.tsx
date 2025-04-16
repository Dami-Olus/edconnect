"use client";

import { useState } from 'react';
import axios from 'axios';

export default function NewProgramPage() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/programs`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Program created!');
      setForm({ title: '', description: '' });
    } catch (err) {
      console.error(err);
      setMessage('Failed to create program');
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Create a New Program</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Program Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border px-3 py-2"
        />
        <textarea
          placeholder="Program Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border px-3 py-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}
