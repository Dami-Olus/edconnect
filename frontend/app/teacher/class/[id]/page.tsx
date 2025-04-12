'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

type ClassType = {
  _id: string;
  title: string;
  description: string;
};

export default function ClassDetailPage() {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState<ClassType | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentIdOrEmail, setStudentIdOrEmail] = useState('');
const [feedback, setFeedback] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClassInfo(res.data);
      } catch (err) {
        console.error('Failed to load class info', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClass();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!classInfo) return <p>Class not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{classInfo.title}</h1>
      <p>{classInfo.description}</p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Add Student</h2>
<form
  onSubmit={async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes/${id}/add-student`,
        { studentIdOrEmail }, // Send the form value
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedback('Student added successfully!');
      setStudentIdOrEmail('');
    } catch (err: any) {
      setFeedback(err.response?.data?.message || 'Failed to add student.');
    }
  }}
  className="space-y-2 mb-4"
>
  <input
    type="text"
    placeholder="Student ID or email"
    value={studentIdOrEmail}
    onChange={(e) => setStudentIdOrEmail(e.target.value)}
    className="border p-2 w-full"
    required
  />
  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
    Add Student
  </button>
  {feedback && <p className="text-sm text-gray-700">{feedback}</p>}
</form>

    </div>
  );
}
