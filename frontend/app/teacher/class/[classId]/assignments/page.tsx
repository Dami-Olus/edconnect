'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Button from '@/components/Button';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
}

export default function AssignmentListPage() {
  const { classId } = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignments/class/${classId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAssignments(res.data);
      } catch (err) {
        console.error('Failed to fetch assignments', err);
      } finally {
        setLoading(false);
      }
    };

    if (classId) fetchAssignments();
  }, [classId]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Assignments</h1>
        <Link
          href={`/teacher/class/${classId}/assignments/create`}
          className="inline-block mb-6"
        >
          <Button>+ Create New Assignment</Button>
        </Link>

        {loading ? (
          <p>Loading...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-600">No assignments created yet.</p>
        ) : (
          <ul className="space-y-3 mt-4">
            {assignments.map((a) => (
              <li
                key={a._id}
                className="p-4 border rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-lg">{a.title}</h2>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(a.dueDate).toDateString()}
                  </p>
                </div>
                <Link
                  href={`/teacher/class/${classId}/assignments/${a._id}`}
                  className="text-blue-600 underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
