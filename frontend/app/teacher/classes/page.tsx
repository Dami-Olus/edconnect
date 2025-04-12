'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type ClassType = {
  _id: string;
  title: string;
  description: string;
};

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setClasses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load classes', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Classes</h2>
      <ul className="space-y-2">
        {classes.map((c) => (
          <li key={c._id} className="p-4 border rounded shadow-sm">
            <h3 className="text-lg font-bold">{c.title}</h3>
            <p>{c.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
