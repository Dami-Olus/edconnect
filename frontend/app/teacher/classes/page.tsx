'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from 'next/link';

interface ClassType {
  _id: string;
  title: string;
  description: string;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.error('Failed to fetch classes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ title: '', description: '' });
      fetchClasses();
    } catch (err) {
      console.error('Class creation failed', err);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Classes</h2>

        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <Input
            name="title"
            placeholder="Class Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            rows={3}
          />
          <Button type="submit">Create Class</Button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-4">
            {classes.map((c) => (
              <li key={c._id} className="p-4 border rounded shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/teacher/class/${c._id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                      {c.title}
                    </Link>
                    <p className="text-sm text-gray-700 mt-1">{c.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}