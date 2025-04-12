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
    </div>
  );
}
