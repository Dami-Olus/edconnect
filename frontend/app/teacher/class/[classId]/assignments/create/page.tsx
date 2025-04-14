'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Layout from '@/components/Layout';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function CreateAssignmentPage() {
  const { classId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignments`,
        {
          title,
          description,
          dueDate,
          classId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Assignment created!');
      router.push(`/teacher/class/${classId}`);
    } catch (err) {
      console.error('Error creating assignment:', err);
      alert('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Create Assignment</h1>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            type="text"
            placeholder="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Assignment'}
          </Button>
        </form>
      </div>
    </Layout>
  );
}